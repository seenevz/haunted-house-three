import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BoxBufferGeometry, ConeBufferGeometry, Group, Mesh, MeshStandardMaterial, Plane, PlaneGeometry, SphereBufferGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#app')!

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * House
 */
// Temporary sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
// scene.add(sphere)

const house = new Group()
scene.add(house)

const walls = new Mesh(
  new BoxBufferGeometry(4, 2.5, 4),
  new MeshStandardMaterial({ color: "#ac8e82" })
)
walls.position.y = 1.25

const roof = new Mesh(
  new ConeBufferGeometry(3.5, 1, 4),
  new MeshStandardMaterial({ color: '#b35f45' })
)

roof.rotation.y = Math.PI * 0.25
roof.position.y = 2.5 + 0.5

const door = new Mesh(
  new PlaneGeometry(2, 2),
  new MeshStandardMaterial({ color: '#aa7b7b' })
)
door.position.y = 1
door.position.z = 2 + 0.001

house.add(walls, roof, door)

const bushGeometry = new SphereBufferGeometry(1, 16, 16)
const bushMaterial = new MeshStandardMaterial({ color: '#89c854' })

const bushesProps: {
  scale: [number, number, number];
  position: [number, number, number];
}[] = [
    {
      scale: [0.5, 0.5, 0.5],
      position: [0.8, 0.2, 2.2]
    },
    {
      scale: [0.25, 0.25, 0.25],
      position: [1.4, 0.1, 2.1]
    },
    {
      scale: [0.4, 0.4, 0.4],
      position: [- 0.8, 0.1, 2.2]
    },
    {
      scale: [0.15, 0.15, 0.15],
      position: [- 1, 0.05, 2.6]
    }
  ]

bushesProps.forEach(({ scale, position }) => {
  const bush = new Mesh(
    bushGeometry,
    bushMaterial
  )
  bush.scale.set(...scale)
  bush.position.set(...position)
  house.add(bush)
})

// Graves

const graves = new Group()
scene.add(graves)

const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new MeshStandardMaterial({ color: '#b2b6b1' })


// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()