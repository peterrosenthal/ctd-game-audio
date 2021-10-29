import * as THREE from 'three';
import SETTINGS from './GameSettings';

export default class Lights {
  private scene: THREE.Scene;

  directional!: THREE.DirectionalLight;
  ambient!: THREE.AmbientLight;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.init();
  }
  
  init(): void {
    // directional
    this.directional = new THREE.DirectionalLight(
      SETTINGS.lights.directional.color,
      SETTINGS.lights.directional.intensity,
    );
    this.directional.position.set(
      SETTINGS.lights.directional.position.x,
      SETTINGS.lights.directional.position.y,
      SETTINGS.lights.directional.position.z,
    );
    this.scene.add(this.directional);

    // ambient
    this.ambient = new THREE.AmbientLight(
      SETTINGS.lights.ambient.color,
      SETTINGS.lights.ambient.intensity,
    );
    this.scene.add(this.ambient);
  }
}
