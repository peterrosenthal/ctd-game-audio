import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import SETTINGS from './GameSettings';

interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export default class PlayerController {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  controls!: PointerLockControls;
  state!: MovementState;
  velocity!: THREE.Vector3;
  direction!: THREE.Vector3;

  menu!: HTMLElement;
  instructions!: HTMLElement;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.init();
  }

  init(): void {
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.menu = document.querySelector('#pause-menu') as HTMLElement;
    this.instructions = document.querySelector('#instructions') as HTMLElement;

    this.menu.addEventListener('click', () => { this.controls.lock(); });
    this.controls.addEventListener('lock', () => { this.hideMenu(); });
    this.controls.addEventListener('unlock', () => { this.showMenu(); });
    document.addEventListener('keydown', (event) => { this.onKeyDown(event); });
    document.addEventListener('keyup', (event) => { this.onKeyUp(event) });
    document.addEventListener('mousedown', () => { this.onMouseDown() });

    this.scene.add(this.controls.getObject());
  }

  update(delta: number): void {
    if (this.controls.isLocked) {
      // set direction based on input state
      this.direction.z = Number(this.state.forward) - Number(this.state.backward);
      this.direction.x = Number(this.state.right) - Number(this.state.left);
      this.direction.normalize();

      // accelerate based on direction
      if (this.state.forward || this.state.backward) {
        this.velocity.z += this.direction.z * SETTINGS.player.acceleration * delta;
      }
      if (this.state.right || this.state.left) {
        this.velocity.x += this.direction.x * SETTINGS.player.acceleration * delta;
      }

      // deaccelerate if no input is active
      if (!this.state.forward && !this.state.backward && !this.state.right && !this.state.left) {
        this.velocity.z -= this.velocity.z * SETTINGS.player.deacceleration * delta;
        this.velocity.x -= this.velocity.x * SETTINGS.player.deacceleration * delta;
      }

      // clamp speed to maximum
      this.velocity.clampLength(0, SETTINGS.player.maxSpeed);

      // move the camera based on velocity
      this.controls.moveRight(this.velocity.x * delta);
      this.controls.moveForward(this.velocity.z * delta);
    }
  }

  hideMenu(): void {
    this.instructions.style.display = 'none';
    this.menu.style.display = 'none';
  }

  showMenu(): void {
    this.menu.style.display = 'block';
    this.instructions.style.display = 'flex';
  }
  
  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.state.forward = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.state.backward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = true;
        break;
    }
  }
  
  onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.state.forward = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.state.backward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = false;
        break;
    }
  }

  onMouseDown(): void {
    if (this.controls.isLocked) {
      const dir = this.camera.getWorldDirection(new THREE.Vector3());
      const theta = Math.asin(dir.dot(new THREE.Vector3(0, 1, 0)));
      if (theta < -Math.PI / 16) {
        const dist = 5 * Math.sin(Math.PI / 2 + theta) /
          (Math.cos(Math.PI / 2 + theta) * this.camera.position.y);
        const pos = new THREE.Vector3(dir.x, 0, dir.z)
          .normalize()
          .multiplyScalar(dist)
          .add(new THREE.Vector3(this.camera.position.x, 0, this.camera.position.z));
        console.log(pos);
      }
    }
  }
}
