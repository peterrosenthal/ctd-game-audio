import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1000,
);
camera.position.set(0, 2, 0);
camera.lookAt(0, 0, -10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-4, 5, 2);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0xe33b4c });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -10);
scene.add(cube);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.connect();
controls.lock();

let previous = 0;
function animate(time: number): void {
  requestAnimationFrame(animate);

  const delta = (time - previous) / 1000;
  previous = time;

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
