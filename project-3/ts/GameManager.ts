import { INoteSequence, SoundFontPlayer } from '@magenta/music/es6';
import { Scene, WebGLRenderer, PerspectiveCamera,  } from 'three';
import Lights from './Lights';
import Skybox from './Skybox';
import Settings from './Settings';
import Generator from './Generator';
import Plant from './Plant';
import { TWINKLE_FIRST_HALF, TWINKLE_SECOND_HALF } from './sequences';
import { delay } from './utils';
import MidiUpload from './components/MidiUpload';

/**
 * The GameManager is the main 'app' that houses all the essentials
 * like the main animation loop and the initialization of all the subcomponents.
 */
export default class GameManager {
  private static sscene: Scene | null | undefined;
  static getScene(): Scene {
    if (this.sscene === null || this.sscene === undefined) {
      this.sscene = new Scene();
    }
    return this.sscene;
  }

  private static srenderer: WebGLRenderer | null | undefined;
  static getRenderer(): WebGLRenderer {
    if (this.srenderer === null || this.srenderer === undefined) {
      this.srenderer = new WebGLRenderer();
      this.srenderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.srenderer.domElement);
    }
    return this.srenderer;
  }

  private settings: Settings;

  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  private generator: Generator;

  constructor() {
    // get Settings instance
    this.settings = Settings.getInstance();

    // THREE scene
    this.scene = GameManager.getScene();

    // THREE camera
    this.camera = new PerspectiveCamera(
      this.settings.camera.fov,
      window.innerWidth / window.innerHeight,
      this.settings.camera.near,
      this.settings.camera.far,
    );
    this.camera.position.set(
      this.settings.camera.position.x,
      this.settings.camera.position.y,
      this.settings.camera.position.z,
    );
    this.camera.lookAt(
      this.settings.camera.lookAt.x,
      this.settings.camera.lookAt.y,
      this.settings.camera.lookAt.z,
    );

    // THREE renderer
    this.renderer = GameManager.getRenderer();

    // THREE skybox
    new Skybox();

    // THREE lights
    new Lights();

    // add the file uploader to the dom
    const midiUpload = new MidiUpload();
    midiUpload.initComponent(document.body);
    

    // test the magenta music generator
    this.generator = new Generator();
    this.testGenerator();

    // start up THREE animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
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

  private animate(): void {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  }
}
