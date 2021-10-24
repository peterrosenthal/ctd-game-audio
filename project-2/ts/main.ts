import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// THREE scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1000,
);
camera.position.set(0, 2, 0);
camera.lookAt(0, 0, -10);

// THREE renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-4, 5, 2);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// demo cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0xe33b4c });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -10);
scene.add(cube);

// controls
interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}
const state: MovementState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const controls = new PointerLockControls(camera, renderer.domElement);
const menu = document.querySelector('#pause-menu') as HTMLDivElement;
const instructions = document.querySelector('#instructions') as HTMLDivElement;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const accel = 40;
const deccel = 10;
const speed = 15;

function hideMenu(): void {
  instructions.style.display = 'none';
  menu.style.display = 'none';
}
function showMenu(): void {
  menu.style.display = 'block';
  instructions.style.display = 'flex';
}
function keyDown(event: KeyboardEvent) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      state.forward = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      state.backward = true;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      state.left = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      state.right = true;
      break;
  }
}
function keyUp(event: KeyboardEvent) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      state.forward = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      state.backward = false;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      state.left = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      state.right = false;
      break;
  }
}

menu.addEventListener('click', () => { controls.lock(); });
controls.addEventListener('lock', hideMenu);
controls.addEventListener('unlock', showMenu);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


scene.add(controls.getObject());

let previous = 0;
function animate(time: number): void {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = (time - previous) / 1000;

    // set direction
    direction.z = Number(state.forward) - Number(state.backward);
    direction.x = Number(state.right) - Number(state.left);
    direction.normalize();

    // accelerate
    if (state.forward || state.backward) {
      velocity.z += direction.z * accel * delta;
    }
    if (state.right || state.left) {
      velocity.x += direction.x * accel * delta;
    }

    // deccelerate
    if (!state.forward && !state.backward && !state.right && !state.left) {
      velocity.z -= velocity.z * deccel * delta;
      velocity.x -= velocity.x * deccel * delta;
    }

    // cap max velocity
    velocity.clampLength(0, speed);

    controls.moveRight(velocity.x * delta);
    controls.moveForward(velocity.z * delta);
  }
  previous = time;

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
