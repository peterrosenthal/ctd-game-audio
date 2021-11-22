import * as mm from '@magenta/music/es6';
import Generator from './Generator';
import { TWINKLE_FIRST_HALF, TWINKLE_SECOND_HALF } from './sequences';
import { delay } from './utils';

export default class GameManager {
  constructor() {
    this.testGenerator();
  }

  private async testGenerator() {
    const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander');
    const generator = new Generator();
    async function playSequence(sequence: mm.INoteSequence): Promise<void> {
      if (player.isPlaying()) {
        player.stop();
      }
      await player.loadSamples(sequence);
      player.start(sequence);
      await delay(500);
      while (player.isPlaying()) {
        await delay(500);
      }
      return;
    }
    let parentA = TWINKLE_FIRST_HALF;
    let parentB = TWINKLE_SECOND_HALF;
    console.log('playing parent A');
    await playSequence(parentA);
    console.log('playing parent B');
    await playSequence(parentB);
    while (true) {
      console.log('generating new child');
      const children = await generator.generateFromParents(parentA, parentB);
      const child = children[0];
      console.log('playing child');
      await playSequence(child);
      parentA = parentB;
      parentB = child;
    }
  }
}
