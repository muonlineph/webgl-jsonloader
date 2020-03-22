/**
 * Simple and basic usage of the Three.js OBJ loader
 */

let scene, camera, renderer = null
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2
let staff = null

const init = function() {
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 200
  
  // Scene
  scene = new THREE.Scene()
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
  scene.add(ambientLight)

  // Point Light
  const pointLight = new THREE.PointLight(0xffffff, 0.9)
  camera.add(pointLight)

  scene.add(camera)

  // Renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor (0xE0E0E0, 1);
  document.body.appendChild(renderer.domElement)

  // Events
  document.addEventListener('mousemove', onDocumentMouseMove, false)
  window.addEventListener( 'resize', onWindowResize, false )
}

// Render the current frame
const render = function() {
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
}

// Continously render the updating frames
const animate = function() {
  requestAnimationFrame(animate)
  staff.rotation.x += 0.01
  staff.rotation.y += 0.01  
  render()
}

const onDocumentMouseMove = function(event) {
  mouseX = (event.clientX - windowHalfX) / 2
  mouseY = (event.clientY - windowHalfY) / 2
}

const onWindowResize = function() {
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

const app = async function() {
  init()
  
  staff = await loadModel('objects/staffofkundun/', 'kundun-OBJ.mtl', 'kundun-OBJ.obj', {
    position: { y:10 },
    rotation: { x:-Math.PI/2, y:-Math.PI/3*2, z:-Math.PI/2 }
  })
  
  scene.add(staff)
  animate()
}
