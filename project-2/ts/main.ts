import * as THREE from 'three';
import GameManager from './GameManager';

const game = new GameManager();

// demo cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ color: 0xe33b4c });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -10);
game.scene.add(cube);

game.start();