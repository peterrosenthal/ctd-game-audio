import * as THREE from 'three';
import GameManager from './GameManager';
import Settings from './Settings';

/**
 * Handles all the lights and adding them to the scene and whatnot.
 * Honestly doesn't need to be a whole-ass class at this point, it's
 * just a constructor lmao. But sometimes I like to over-structure
 * thing just in case I want to expand them later.
 */
export default class Lights {
  private settings: Settings;
  private scene: THREE.Scene;

  private directional: THREE.DirectionalLight;
  private ambient: THREE.AmbientLight;

  constructor() {
    this.settings = Settings.getInstance();
    this.scene = GameManager.getScene();

    // directional light
    this.directional = new THREE.DirectionalLight(
      this.settings.lights.directional.color,
      this.settings.lights.directional.intensity,
    );
    this.directional.position.set(
      this.settings.lights.directional.position.x,
      this.settings.lights.directional.position.y,
      this.settings.lights.directional.position.z,
    );
    this.scene.add(this.directional);

    // ambient light
    this.ambient = new THREE.AmbientLight(
      this.settings.lights.ambient.color,
      this.settings.lights.ambient.intensity,
    );
    this.scene.add(this.ambient);
  }
}
