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

enum ActionType {
  SIZE,
  TIME,
}

interface OscinoodleInfo {
  oscinoodle: Oscinoodle;
  distance: number;
  angle: number;
  plane: THREE.Vector3;
  action: ActionType;
}

export default class PlayerController {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  raycaster!: THREE.Raycaster;
  controls!: PointerLockControls;
  state!: MovementState;
  velocity!: THREE.Vector3;
  direction!: THREE.Vector3;

  menu!: HTMLElement;
  instructions!: HTMLElement;
  crosshair!: HTMLElement;

  dragging: Boolean = false;

  oscinoodles!: Oscinoodle[];
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
    this.oscinoodles = [];

    // raycaster object
    this.raycaster = new THREE.Raycaster();

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
    this.crosshair = document.querySelector('#crosshair') as HTMLElement;

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
        // get the relative angle between dir vector and action plane
        const theta = Math.asin(dir.dot(this.activeObject.plane));
        if (this.activeObject.action === ActionType.SIZE) {
          // approximate the height that the mouse has been dragged up from the ground
          let height = (1 + this.activeObject.distance * Math.tan(theta - this.activeObject.angle)) / 2;
          // bit of a hack to fix bad math...
          if (theta - this.activeObject.angle > 0
            && Math.tan(theta - this.activeObject.angle) < 0) {
            // set height to a big-enough "default maximum" or something like that
            height = 700;
          }
          this.activeObject.oscinoodle.setHeight(height);
        } else if (this.activeObject.action === ActionType.TIME) {
          this.activeObject.oscinoodle.setRotation(
            this.activeObject.plane,
            theta * 1.5,
            0.9 * theta * Math.sqrt(Math.sqrt(this.activeObject.distance)),
          );
        }
      }
    }
  }

  lockControls(): void {
    this.controls.lock();
  }

  hideMenu(): void {
    this.instructions.style.display = 'none';
    this.menu.style.display = 'none';
    this.crosshair.style.display = 'block';
  }

  showMenu(): void {
    this.crosshair.style.display = 'none';
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

  onMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      if (this.controls.isLocked) {
        // set the dragging variable to true, onMouseUp() should handle turning it back to false
        this.dragging = true;

        // the plane we are concerned with checking here is always going to be the x-z plane (y = 0)
        const plane = new THREE.Vector3(0, 1, 0);

        // check the raycaster to see if we are intersecting any
        // existing oscinoodles before we try creating a new one
        this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
        for (const noodle of this.oscinoodles) {
          if (this.raycaster.intersectObjects(noodle.meshes).length > 0) {
            // get the distance to the bottom of the noodle
            const dist = this.camera.position.distanceTo(noodle.position);

            // multi-step process to get the angle the camera would be at if it were to be looking at the bottom of the noodle
            // step 1: create a ray looking at the bootom of the noodle
            const ray = new THREE.Ray(this.camera.position, new THREE.Vector3());
            ray.lookAt(noodle.position);
            // step 2: get vector representing 3d direction of the ray to the bottom of the noodle
            const dir = new THREE.Vector3().copy(ray.direction).normalize();
            // step 3: get the relative angle between dir vector and the x-z plane
            const theta = Math.asin(dir.dot(plane));

            // keep track of some of the object's info while dragging the mouse
            this.activeObject = {
              oscinoodle: noodle,
              distance: dist,
              angle: theta,
              plane: plane,
              action: ActionType.SIZE,
            };
            // return so that we skip over all of the code that would handle creating a new noodle
            return;
          }
        }

        // get vector representing 3d direction the camera is facing
        const dir = this.camera.getWorldDirection(new THREE.Vector3());
        // get the relative angle between dir vector and x-z plane
        const theta = Math.asin(dir.dot(plane));
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

          // instantiate new oscinoodle (previously know as bouncy boi) at the detected position
          const newdle = new Oscinoodle(this.scene, pos);
          this.oscinoodles.push(newdle);
          this.activeObject = {
            oscinoodle: newdle,
            distance: dist,
            angle: theta,
            plane: plane,
            action: ActionType.SIZE,
          };
        }
      }
    } else if (event.button === 2) {
      // set the dragging variable to true, onMouseUp() should handle turning it back to false
      this.dragging = true;

      // check the raycaster to see if we are intersecting any noodles
      this.raycaster.setFromCamera(new THREE.Vector2(), this.camera);
      for (const noodle of this.oscinoodles) {
        if (this.raycaster.intersectObjects(noodle.meshes).length > 0) {
          // get the distance to the bottom of the noodle
          const dist = this.camera.position.distanceTo(noodle.position);

          // get vector representing 3d direction the camera is facing
          const dir = this.camera.getWorldDirection(new THREE.Vector3());
          // get the plane which is currently bisecting the screen left from right
          const plane = new THREE.Vector3(dir.z, 0, -dir.x).normalize();

          // keep track of some of the object's info while dragging the mouse
          this.activeObject = {
            oscinoodle: noodle,
            distance: dist,
            angle: 0,
            plane: plane,
            action: ActionType.TIME,
          }
        }
      }
    }
  }
}
