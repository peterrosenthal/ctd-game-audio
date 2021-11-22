import * as mm from '@magenta/music/es6';
import Settings from './Settings';
import { getSkewedRandom } from './utils';

export default class Generator {
  private settings: Settings;

  private mvae: mm.MusicVAE;
  private checkpointUrl: string;
  private numChildren: number;
  private parentSimilaritySkew: number;
  private parentSimilarityTemperature: number;
  private interpolationResolution: number;

  constructor() {
    this.settings = Settings.getInstance();

    this.checkpointUrl = this.settings.generator.checkPointUrl;
    this.mvae = new mm.MusicVAE(this.checkpointUrl);
    this.numChildren = this.settings.generator.numChildren;
    this.parentSimilaritySkew = this.settings.generator.parentSimilaritySkew;
    this.parentSimilarityTemperature = this.settings.generator.parentSimilarityTemperature;
    this.interpolationResolution = this.settings.generator.interpolationResolutuion;
  }

  async generateFromParents(parentA: mm.INoteSequence, parentB: mm.INoteSequence): Promise<mm.INoteSequence[]> {
    this.checkSettingsForUpdates();
    const children: mm.INoteSequence[] = [];
    for (let i = 0; i < this.numChildren; i++) {
      const parents: mm.INoteSequence[] = [];
      await this.mvae.initialize();
      parents.push((await this.mvae.similar(parentA, 1, getSkewedRandom(0, 1, this.parentSimilaritySkew), this.parentSimilarityTemperature))[0]);
      parents.push((await this.mvae.similar(parentB, 1, getSkewedRandom(0, 1, this.parentSimilaritySkew), this.parentSimilarityTemperature))[0]);
      const results: mm.INoteSequence[] = await this.mvae.interpolate(parents, this.interpolationResolution);
      children.push(results[Math.floor(getSkewedRandom(0, results.length, 1))]);
    }
    return children;
  }

  private checkSettingsForUpdates() {
    if (this.checkpointUrl != this.settings.generator.checkPointUrl) {
      this.checkpointUrl = this.settings.generator.checkPointUrl;
      this.mvae = new mm.MusicVAE(this.checkpointUrl);
    }
    if (this.numChildren != this.settings.generator.numChildren) {
      this.numChildren = this.settings.generator.numChildren;
    }
    if (this.parentSimilaritySkew != this.settings.generator.parentSimilaritySkew) {
      this.parentSimilaritySkew = this.settings.generator.parentSimilaritySkew;
    }
    if (this.parentSimilarityTemperature != this.settings.generator.parentSimilarityTemperature) {
      this.parentSimilarityTemperature = this.settings.generator.parentSimilarityTemperature;
    }
    if (this.interpolationResolution != this.settings.generator.interpolationResolutuion) {
      this.interpolationResolution = this.settings.generator.interpolationResolutuion;
    }
  }
}
