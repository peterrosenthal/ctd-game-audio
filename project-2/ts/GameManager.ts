import * as THREE from 'three';
import SETTINGS from './GameSettings';
import Ground from './Ground';
import Lights from './Lights';
import PlayerController from './PlayerController';
import Skybox from './Skybox';

export default class GameManager {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  listener!: THREE.AudioListener;

  skybox!: Skybox;
  lights!: Lights;
  ground!: Ground;
  player!: PlayerController;

  time: number;

  constructor() {
    this.time = 0;
    this.init();
  }

  init(): void {
    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      SETTINGS.camera.fov,
      window.innerWidth / window.innerHeight,
      SETTINGS.camera.near,
      SETTINGS.camera.far,
    );
    this.camera.position.set(
      SETTINGS.camera.position.x,
      SETTINGS.camera.position.y,
      SETTINGS.camera.position.z,
    );
    this.camera.lookAt(
      SETTINGS.camera.lookAt.x,
      SETTINGS.camera.lookAt.y,
      SETTINGS.camera.lookAt.z,
    );

    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // audio listener
    this.listener = new THREE.AudioListener();

    // skybox
    this.skybox = new Skybox(this.scene, this.renderer);

    // lights
    this.lights = new Lights(this.scene);

    // player controller
    this.player = new PlayerController(this.scene, this.camera, this.renderer, this.listener);
  }

  start(): void {
    requestAnimationFrame((time) => { this.animate(time) });
  }

  animate(time: number): void {
    requestAnimationFrame((time) => { this.animate(time) });

    const delta = (time - this.time) / 1000;
    this.time = time;

    this.player.update(delta);

    this.renderer.render(this.scene, this.camera);
  }
}
