/**
 * Reactive settings. Use the static method getInstance() to (initialize
 * or) get the singleton instance of this class which running in the app.
 */
export default class Settings {
  private static instance: Settings | null | undefined;
  static getInstance(): Settings {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new Settings();
    }
    return this.instance;
  }

  player = {
    url: 'https://storage.googleapis.com/magentadata/js/soundfonts/salamander',
  };

  generator = {
    checkPointUrl: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
    numChildren: 1,
    parentSimilaritySkew: 0.3,
    parentSimilarityTemperature: 1.0,
    interpolationResolutuion: 100,
  };

  camera = {
    fov: 55,
    near: 0.1,
    far: 1000,
    position: {
      x: 0,
      y: 0.75,
      z: 3,
    },
    lookAt: {
      x: 0,
      y: 1,
      z: 0,
    },
  };

  lights = {
    directional: {
      color: 0xfffffff,
      intensity: 0.3,
      position: {
        x: 5,
        y: 7,
        z: 2,
      },
    },
    ambient: {
      color: 0xffffff,
      intensity: 0.7,
    },
  };

  private constructor() {
  }
}
