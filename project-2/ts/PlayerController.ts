import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import Oscinoodle from './Oscinoodle';
import SETTINGS from './GameSettings';

interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

interface OscinoodleInfo {
  oscinoodle: Oscinoodle;
  distance: number;
  angle: number;
}

export default class PlayerController {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  controls!: PointerLockControls;
  state!: MovementState;
  velocity!: THREE.Vector3;
  direction!: THREE.Vector3;

  menu!: HTMLElement;
  instructions!: HTMLElement;

  dragging: Boolean = false;

  activeObject?: OscinoodleInfo;

  constructor(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer) {
    // assign private members
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // bind event functions
    this.lockControls = this.lockControls.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // rest of object initialization
    this.init();
  }

  init(): void {
    // pointer-lock-controls object
    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    // movement input state
    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    // velocity and direction
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // get dom elements
    this.menu = document.querySelector('#pause-menu') as HTMLElement;
    this.instructions = document.querySelector('#instructions') as HTMLElement;

    // add event functions as event listeners
    this.menu.addEventListener('click', this.lockControls);
    this.controls.addEventListener('lock', this.hideMenu);
    this.controls.addEventListener('unlock', this.showMenu);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);

    // add controls object to the scene
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

      // handle mouse dragging behaviour
      if (this.dragging && this.activeObject !== undefined) {
        // get vector representing 3d direction the camera is facing
        const dir = this.camera.getWorldDirection(new THREE.Vector3());
        // get the relative angle between dir vector and x-z plane
        const theta = Math.asin(dir.dot(new THREE.Vector3(0, 1, 0)));
        // approximate the height that the mouse has been dragged up from the ground
        let height = (1 + this.activeObject.distance * Math.tan(theta - this.activeObject.angle)) / 2;
        // bit of a hack to fix bad math...
        if (theta - this.activeObject.angle > 0
          && Math.tan(theta - this.activeObject.angle) < 0) {
          // set height to a big-enough "default maximum" or something like that
          height = 700;
        }
        this.activeObject.oscinoodle.setHeight(height);
      }
    }
  }

  lockControls(): void {
    this.controls.lock();
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

  onMouseUp(): void {
    // set the dragging variable to false regardless of if the camera is locked or not... false is the safe default state
    this.dragging = false;
    this.activeObject = undefined;
  }

  onMouseDown(): void {
    if (this.controls.isLocked) {
      // set the dragging variable to true, onMouseUp() should handle turning it back to false
      this.dragging = true;

      // get vector representing 3d direction the camera is facing
      const dir = this.camera.getWorldDirection(new THREE.Vector3());
      // get the relative angle between dir vector and x-z plane
      const theta = Math.asin(dir.dot(new THREE.Vector3(0, 1, 0)));
      if (theta < -Math.PI / 16) {
        // if we are looking sufficiently down enough, then using basic trig, calculate the
        // distance at which a ray projected from the camera intersects with the x-z plane (y = 0)
        const dist = 5 * Math.sin(Math.PI / 2 + theta) /
          (Math.cos(Math.PI / 2 + theta) * this.camera.position.y);
        // using x and z from the dir vector, translate intersection distance to actual position of intersection
          const pos = new THREE.Vector3(dir.x, 0, dir.z)
          .normalize()
          .multiplyScalar(dist)
          .add(new THREE.Vector3(this.camera.position.x, 0, this.camera.position.z));
        // instantiate oscinoodle (previously know as bouncy boi) at the detected position
        this.activeObject = {
          oscinoodle: new Oscinoodle(this.scene, pos),
          distance: dist,
          angle: theta,
        };
      }
    }
  }
}
