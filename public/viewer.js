/**
 * Renders a Three.js scene with default lighting.
 * OBJ models of THREE.OBJLoader type can be added and removed anytime.
 * @param {Array} models - Array of THREE.OBJLoader models (object files)
 */

function Viewer(models) {
  this.scene = null
  this.camera = null
  this.renderer = null
  this.mouseX = 0
  this.mouseY = 0;
  this.windowHalfX = window.innerWidth / 2
  this.windowHalfY = window.innerHeight / 2
  this.models = []
  this.animationFrameId = null

  this.init()

  // Add models to scene
  if (models) {
    models.forEach(item => {
      this.models.push(item)
      this.scene.add(item)
    })
  }

  this.animate()
}


/**
 * Initialize Three.js objects: camera, scene, renderer, lights.
 * Register DOM event listeners and bind app methods.
 */
Viewer.prototype.init = function() {
  // Camera
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  this.camera.position.z = 200

  // Scene
  this.scene = new THREE.Scene()
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
  this.scene.add(ambientLight)

  // Point Light
  const pointLight = new THREE.PointLight(0xffffff, 0.9)
  this.camera.add(pointLight)

  this.scene.add(this.camera)

  // Renderer
  this.renderer = new THREE.WebGLRenderer()
  this.renderer.setPixelRatio(window.devicePixelRatio)
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  this.renderer.setClearColor (0xE0E0E0, 1);
  document.body.appendChild(this.renderer.domElement)

  // DOM Events
  this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this)
  this.onWindowResize = this.onWindowResize.bind(this)
  this.onDocumentClick = this.onClick.bind(this)

  document.addEventListener('click', this.onDocumentClick, false)
  document.addEventListener('mousemove', this.onDocumentMouseMove, false)
  window.addEventListener( 'resize', this.onWindowResize, false)

  // App Events
  this.animate = this.animate.bind(this)
  this.render = this.render.bind(this)
}


// Render a snapshot of the current frame
Viewer.prototype.render = function() {
  this.camera.position.x += (this.mouseX - this.camera.position.x) * .05
  this.camera.position.y += (- this.mouseY - this.camera.position.y) * .05
  this.camera.lookAt(this.scene.position)
  this.renderer.render(this.scene, this.camera)
}


// Continously render and update the frames
Viewer.prototype.animate = function() {
  this.animationFrameId = requestAnimationFrame(this.animate)

  // Rotate the model(s)
  this.models.forEach(item => {
    item.rotation.x += 0.01
    item.rotation.y += 0.01
  })

  this.render()
}

// Stop the animation, cancelling the requestAnimationFrame ID
Viewer.prototype.stopAnimation = function() {
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = null
  }
}

/**
 * Update the mouse pointer position as it moves.
 * This will adjust the camera angle during render()
 */
Viewer.prototype.onDocumentMouseMove = function(event) {
  this.mouseX = (event.clientX - this.windowHalfX) / 2
  this.mouseY = (event.clientY - this.windowHalfY) / 2
}


// Adjust the viewport and scale the scene when the window is resized
Viewer.prototype.onWindowResize = function() {
  this.windowHalfX = window.innerWidth / 2
  this.windowHalfY = window.innerHeight / 2

  this.camera.aspect = window.innerWidth / window.innerHeight
  this.camera.updateProjectionMatrix()

  this.renderer.setSize(window.innerWidth, window.innerHeight)
}

// Process page click event - stop or restart the animation
Viewer.prototype.onClick = function(e) {
  const { target } = e

  // Skip processing radio button clicks if anim is running
  if (
    target?.tagName === 'INPUT' &&
    target?.type === 'radio' &&
    this.animationFrameId
  ) return

  if (this.animationFrameId) {
    this.stopAnimation()
  } else {
    this.animate()
  }
}

// Add a new object model to the scene
Viewer.prototype.addModel = function(model) {
  if (!model) {
    return
  }

  this.models.push(model)
  this.scene.add(model)
}


// Delete an object model from the scene
Viewer.prototype.removeModel = function(model) {
  if (!model) {
    return
  }

  this.scene.remove(model)
  this.models = this.models.filter(x => x.uuid !== model.uuid)
}