import { Scene, DirectionalLight, AmbientLight } from 'three';
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

  private directional: DirectionalLight;
  private ambient: AmbientLight;

  constructor(scene: Scene) {
    this.settings = Settings.getInstance();

    // directional light
    this.directional = new DirectionalLight(
      this.settings.lights.directional.color,
      this.settings.lights.directional.intensity,
    );
    this.directional.position.set(
      this.settings.lights.directional.position.x,
      this.settings.lights.directional.position.y,
      this.settings.lights.directional.position.z,
    );
    scene.add(this.directional);

    // ambient light
    this.ambient = new AmbientLight(
      this.settings.lights.ambient.color,
      this.settings.lights.ambient.intensity,
    );
    scene.add(this.ambient);
  }
}
