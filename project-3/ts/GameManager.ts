import { INoteSequence, SoundFontPlayer } from '@magenta/music/es6';
import { delay } from './utils';
import Plant from './Plant';
import Combinator from './components/Combinator';
import Settings from './components/Settings';

/**
 * The GameManager is the main 'app' that houses all the essentials
 * like the main animation loop and the initialization of all the subcomponents.
 */
export default class GameManager {
  private static plants?: Plant[];
  public static getPlants(): Plant[] {
    if (this.plants === undefined) {
      this.plants = [];
    }
    return this.plants;
  }
  public static addPlant(plant: Plant): void {
    if (this.plants === undefined) {
      this.plants = [];
    }
    this.plants.push(plant);
  }
  public static removePlant(plant: Plant): void {
    if (this.plants === undefined) {
      return;
    }
    this.plants = this.plants.filter(thisplant => thisplant != plant);
  }

  private static settings?: Settings;
  private static url?: string;
  private static player?: SoundFontPlayer;
  public static async playSequence(sequence: INoteSequence): Promise<void> {
    if (this.settings === undefined) {
      this.settings = Settings.getInstance();
    }
    console.log(this.settings.player.url);
    if (this.url === undefined) {
      this.url = this.settings.player.url;
    }
    if (this.player === undefined) {
      this.player = new SoundFontPlayer(this.url);
    }
    if (this.settings.player.url !== this.url) {
      this.player = new SoundFontPlayer(this.url);
    }
    if (this.player.isPlaying()) {
      this.stopPlayer();
    }
    await this.player.loadSamples(sequence);
    this.player.start(sequence);
    await delay(500);
    while (this.player.isPlaying()) {
      await delay(500);
    }
    return;
  }
  public static stopPlayer(): void {
    this.player?.stop();
  }

  constructor() {
    // add the settings component to the dom
    const settings = Settings.getInstance();
    settings.initComponentToParent(document.body);

    // add the combinator component to the dom
    const combinator = new Combinator();
    combinator.initComponentToParent(document.body);
  }
}
