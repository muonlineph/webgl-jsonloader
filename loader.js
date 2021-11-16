/**
 * Aynchronously load and return a 3d object model.
 * Requires three.js r114
 * @param {String} directory - Relative path of object files directory
 * @param {String} mtlFile - Material name
 * @param {String} objFile - Object Name
 * @param {String} offset - Custom rotation and position offsets for the loaded object
 *  > position: Object [+/-] Number {x,y,z} position offsets
 *  > rotation: Object [+/-] Float {x,y,z} rotation offsets (Math.PI)
 * @param {Boolean} usesTga - Loads the TGALoader file handler if the model uses TGA assets
 */
async function loadModel(directory, mtlFile, objFile, offset, usesTga = false) {
  if (!directory || !mtlFile || !objFile) {
    throw new Error('Missing required parameters')
  }

  const manager = new THREE.LoadingManager()
  manager.addHandler(/\.dds$/i, new THREE.DDSLoader())

  // Import TGALoader if your asset uses TGA textures
  if (usesTga) {
    manager.addHandler( /\.tga$/i, new THREE.TGALoader())
  }
  
  return new Promise((resolve, reject) => {
    const mtlLoader = new THREE.MTLLoader(manager).setPath(directory)

    mtlLoader.load(mtlFile, function(materials) {
      materials.preload()

      // Make TGA and PNG transparent
      Object.keys(materials.materials).forEach(item => {
        if (/.tga/g.test(item) || /.png/g.test(item)) {
          materials.materials[item].transparent = true
        }
      })

      new THREE.OBJLoader(manager)
        .setMaterials(materials)
        .setPath(directory)
        .load(objFile, function(object) {
          // set custom offsets
          if (offset) {
            if (offset.position) {
              Object.keys(offset.position).forEach(item => {
                object.position[item] = offset.position[item]
              })
            }

            if (offset.rotation) {
              Object.keys(offset.rotation).forEach(item => {
                object.rotation[item] = offset.rotation[item]
              })
            }

            if (offset.scale) {
              Object.keys(offset.scale).forEach(item => {
                object.scale[item] = offset.scale[item]
              })
            }
          }
      
          console.log('object loaded!')
          resolve(object)
        },
        (xhr) => {
          // downloading progress
          if (xhr.lengthComputable) {
            let percentComplete = xhr.loaded / xhr.total * 100
            console.log(`${Math.round(percentComplete, 2)}% downloaded`)
          }
        },
        () => {
          // Download error
          reject(null)
        })
    })
  })
}