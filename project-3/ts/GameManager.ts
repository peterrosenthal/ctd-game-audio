import { INoteSequence, SoundFontPlayer } from '@magenta/music/es6';
import Generator from './Generator';
import Plant from './Plant';
import { TWINKLE_FIRST_HALF, TWINKLE_SECOND_HALF } from './sequences';
import { delay } from './utils';
import MidiUpload from './components/MidiUpload';
import Combinator from './components/Combinator';

/**
 * The GameManager is the main 'app' that houses all the essentials
 * like the main animation loop and the initialization of all the subcomponents.
 */
export default class GameManager {
  private generator: Generator;

  constructor() {
    // add the file uploader to the dom
    const midiUpload = new MidiUpload();
    midiUpload.initComponent(document.body);

    // add the combinator component to the dom
    const combinator = new Combinator();
    combinator.initComponent(document.body);
    
    // test the magenta music generator
    this.generator = new Generator();
    // this.testGenerator();
  }

  private async testGenerator(): Promise<void> {
    const player = new SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander');
    async function playSequence(sequence: INoteSequence): Promise<void> {
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
    let parentA = new Plant(TWINKLE_FIRST_HALF);
    parentA.moveToTheLeft();
    let parentB = new Plant(TWINKLE_SECOND_HALF);
    const plants: Plant[] = [];
    plants.push(parentA);
    plants.push(parentB);
    console.log('playing parent A');
    await playSequence(parentA.sequence);
    console.log('playing parent B');
    await playSequence(parentB.sequence);
    while (true) {
      console.log('generating new child');
      const children = await this.generator.generateFromParents(parentA, parentB);
      for (let plant of plants) {
        plant.moveToTheLeft();
      }
      const child = children[0];
      console.log('playing child');
      await playSequence(child.sequence);
      parentA = parentB;
      parentB = child;
      plants.push(child);
    }
  }
}
