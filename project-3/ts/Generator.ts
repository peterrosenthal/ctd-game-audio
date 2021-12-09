import { INoteSequence, MusicVAE } from '@magenta/music/es6';
import Settings from './Settings';
import Plant from './Plant';
import { getSkewedRandom } from './utils';

/**
 * Generates melodies that are like genetic children of two (specified)
 * parent melodies using Google Magenta's MusicVAE. Then using the Plant
 * class that I wrote, associates that melody with a plant. (note: all
 * plant generation actually takes place in the Plant.ts class, not this one)
 */
export default class Generator {
  private settings: Settings;

  private mvae: MusicVAE;
  private checkpointUrl: string;
  private numChildren: number;
  private parentSimilaritySkew: number;
  private parentSimilarityTemperature: number;
  private interpolationResolution: number;

  constructor() {
    this.settings = Settings.getInstance();

    this.checkpointUrl = this.settings.generator.checkPointUrl;
    this.mvae = new MusicVAE(this.checkpointUrl);
    this.numChildren = this.settings.generator.numChildren;
    this.parentSimilaritySkew = this.settings.generator.parentSimilaritySkew;
    this.parentSimilarityTemperature = this.settings.generator.parentSimilarityTemperature;
    this.interpolationResolution = this.settings.generator.interpolationResolutuion;
  }

  async generateFromParents(parentA: Plant, parentB: Plant): Promise<Plant[]> {
    this.checkSettingsForUpdates();
    const children: Plant[] = [];
    for (let i = 0; i < this.numChildren; i++) {
      const parents: INoteSequence[] = [];
      await this.mvae.initialize();
      parents.push((await this.mvae.similar(
        parentA.sequence,
        1,
        getSkewedRandom(0, 1, this.parentSimilaritySkew),
        this.parentSimilarityTemperature,
      ))[0]);
      parents.push((await this.mvae.similar(
        parentB.sequence,
        1,
        getSkewedRandom(0, 1, this.parentSimilaritySkew),
        this.parentSimilarityTemperature,
      ))[0]);
      const results: INoteSequence[] = await this.mvae.interpolate(
        parents,
        this.interpolationResolution,
      );
      children.push(new Plant(results[Math.floor(getSkewedRandom(0, results.length, 1))]));
    }
    return children;
  }

  private checkSettingsForUpdates() {
    if (this.checkpointUrl != this.settings.generator.checkPointUrl) {
      this.checkpointUrl = this.settings.generator.checkPointUrl;
      this.mvae = new MusicVAE(this.checkpointUrl);
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
