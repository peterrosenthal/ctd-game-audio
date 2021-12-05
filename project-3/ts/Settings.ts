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

  generator = {
    checkPointUrl: 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small',
    numChildren: 1,
    parentSimilaritySkew: 0.3,
    parentSimilarityTemperature: 1.0,
    interpolationResolutuion: 100,
  };

  camera = {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: {
      x: 0,
      y: 0.75,
      z: 4,
    },
    lookAt: {
      x: 0,
      y: 1,
      z: 0,
    },
  };

  lights = {
    directional: {
      color: 0xfffffee,
      intensity: 0.5,
      position: {
        x: 5,
        y: 7,
        z: 2,
      },
    },
    ambient: {
      color: 0xeeffff,
      intensity: 0.5,
    },
  };

  private constructor() {
  }
}
