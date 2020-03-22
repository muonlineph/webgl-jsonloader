/**
 * Aynchronously load and return a 3d object model.
 * Requires three.js r114
 * @param {String} directory - Relative path of object files directory
 * @param {String} mtlFile - Material name
 * @param {String} objFile - Object Name
 * @param {String} offset - Custom rotation and position offsets for the loaded object
 *  > position: Object [+/-] Number {x,y,z} position offsets
 *  > rotation: Object [+/-] Float {x,y,z} rotation offsets (Math.PI)
 */
async function loadModel(directory, mtlFile, objFile, offset) {
  if (!directory || !mtlFile || !objFile) {
    throw new Error('Missing required parameters')
  }

  const manager = new THREE.LoadingManager()
  manager.addHandler(/\.dds$/i, new THREE.DDSLoader())

  return new Promise((resolve, reject) => {
    new THREE.MTLLoader(manager)
      .setPath(directory)
      .load(mtlFile, function(materials) {
        materials.preload()

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