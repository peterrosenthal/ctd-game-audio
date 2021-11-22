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

  private constructor() {
  }
}