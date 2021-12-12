import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Component from './Component';
import GameManager from '../GameManager';
import Lights from '../Lights';
import Plant from '../Plant';
import Settings from '../Settings';
import Skybox from '../Skybox';
import { delay } from '../utils';

export default class Child extends Component {
  private settings: Settings;

  private canvas: HTMLCanvasElement;
  private buttons: HTMLDivElement;
  private saveButton: HTMLButtonElement;
  private saveImage: HTMLImageElement;
  private playButton: HTMLButtonElement;
  private playImage: HTMLImageElement;

  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;

  plant?: Plant;

  constructor() {
    super();

    // get the settings instance
    this.settings = Settings.getInstance();

    // bind animate and event listeners
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
    this.onSaveButtonMouseEnter = this.onSaveButtonMouseEnter.bind(this);
    this.onSaveButtonMouseLeave = this.onSaveButtonMouseLeave.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onPlayButtonMouseEnter = this.onPlayButtonMouseEnter.bind(this);
    this.onPlayButtonMouseLeave = this.onPlayButtonMouseLeave.bind(this);
    this.onStopButtonClick = this.onStopButtonClick.bind(this);
    this.onStopButtonMouseEnter = this.onStopButtonMouseEnter.bind(this);
    this.onStopButtonMouseLeave = this.onStopButtonMouseLeave.bind(this);

    // add window resize event listener
    window.addEventListener('resize', this.onWindowResize);

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.left = '50%';
    this.element.style.zIndex = '2';
    this.element.style.width = '13em';
    this.element.style.marginLeft = '-6.5em';
    this.element.style.padding = '0';

    // create the canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.margin = '0';
    this.canvas.style.border = '1px solid #8ab1b4';
    this.canvas.style.borderRadius = '0.2em';
    this.element.appendChild(this.canvas);

    // create the buttons bar
    this.buttons = document.createElement('div');
    this.buttons.style.width = '100%';
    this.buttons.style.display = 'flex';
    this.buttons.style.flexFlow = 'row';
    this.buttons.style.alignItems = 'center';
    this.buttons.style.justifyContent = 'space-between';
    this.element.appendChild(this.buttons);

    // save to inventory button
    this.saveButton = document.createElement('button');
    this.saveButton.style.background = 'none';
    this.saveButton.style.border = 'none';
    this.saveButton.addEventListener('click', this.onSaveButtonClick);
    this.saveButton.addEventListener('mouseenter', this.onSaveButtonMouseEnter);
    this.saveButton.addEventListener('mouseleave', this.onSaveButtonMouseLeave);
    this.buttons.appendChild(this.saveButton);
    this.saveImage = document.createElement('img');
    this.saveImage.alt = 'Save';
    this.saveImage.title = 'Save plant to inventory';
    this.saveImage.src = './images/save-light.svg';
    this.saveButton.appendChild(this.saveImage);

    // play button
    this.playButton = document.createElement('button');
    this.playButton.style.background = 'none';
    this.playButton.style.border = 'none';
    this.playButton.addEventListener('click', this.onPlayButtonClick);
    this.playButton.addEventListener('mouseenter', this.onPlayButtonMouseEnter);
    this.playButton.addEventListener('mouseleave', this.onPlayButtonMouseLeave);
    this.buttons.appendChild(this.playButton);
    this.playImage = document.createElement('img');
    this.playImage.alt = 'Play';
    this.playImage.title = 'Play the plant\'s song';
    this.playImage.src = './images/play-light.svg';
    this.playButton.appendChild(this.playImage);
  }

  override componentHasInitialized(): void {
    // create the THREE scene, camera, and renderer
    this.scene = new Scene();
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
    this.renderer = new WebGLRenderer({ canvas: this.canvas, });
    if (this.element !== undefined) {
      this.renderer.setSize(this.canvas.width, this.canvas.width);
      this.resizeCanvasDelay();
    }

    // create the THREE skybox and lights
    new Skybox(this.scene, this.renderer);
    new Lights(this.scene);

    // start animation loop
    requestAnimationFrame(this.animate);
  }

  setPlant(plant: Plant): void {
    this.plant?.removeFromScene();
    this.plant = plant;
    if (this.scene !== undefined) {
      this.plant.addToScene(this.scene);
    }
  }

  showButtons(): void {
    this.buttons.style.display = 'flex';
  }

  hideButtons(): void {
    this.buttons.style.display = 'none';
  }

  setPosition(position: number): void {
    if (this.element === undefined) {
      return;
    }
    this.element.style.left = `${position}%`;
  }

  setZIndex(zIndex: number): void {
    if (this.element === undefined) {
      return;
    }
    this.element.style.zIndex = `${zIndex}`;
  }

  private animate(): void {
    requestAnimationFrame(this.animate);

    if (this.renderer !== undefined && this.scene !== undefined && this.camera !== undefined) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private resizeCanvas(): void {
    if (this.renderer !== undefined && this.element !== undefined) {
      this.renderer.setSize(
        Math.floor(this.element.clientWidth),
        Math.floor(this.element.clientWidth),
      );
    } 
  }

  private async resizeCanvasDelay(): Promise<void> {
    await delay(3);
    this.resizeCanvas();
  }

  private onWindowResize(): void {
    this.resizeCanvas();
  }

  private onSaveButtonClick(): void {
    if (this.plant === undefined) {
      return;
    }
    GameManager.addPlant(this.plant);
  }

  private onSaveButtonMouseEnter(): void {
    this.saveImage.src = './images/save-dark.svg';
  }

  private onSaveButtonMouseLeave(): void {
    this.saveImage.src = './images/save-light.svg';
  }

  private onPlayButtonClick(): void {
    this.playButton.removeEventListener('click', this.onPlayButtonClick);
    this.playButton.removeEventListener('mouseenter', this.onPlayButtonMouseEnter);
    this.playButton.removeEventListener('mouseleave', this.onPlayButtonMouseLeave);
    this.playButton.addEventListener('click', this.onStopButtonClick);
    this.playButton.addEventListener('mouseenter', this.onStopButtonMouseEnter);
    this.playButton.addEventListener('mouseleave', this.onStopButtonMouseLeave);

    this.playImage.alt = 'Stop';
    this.playImage.title = 'Stop the plant\'s song';
    this.playImage.src = './images/stop-light.svg';

    this.playSequence();
  }

  private onPlayButtonMouseEnter(): void {
    this.playImage.src = './images/play-dark.svg';
  }

  private onPlayButtonMouseLeave(): void {
    this.playImage.src = './images/play-light.svg';
  }

  private onStopButtonClick(): void {
    this.playButton.removeEventListener('click', this.onStopButtonClick);
    this.playButton.removeEventListener('mouseenter', this.onStopButtonMouseEnter);
    this.playButton.removeEventListener('mouseleave', this.onStopButtonMouseLeave);
    this.playButton.addEventListener('click', this.onPlayButtonClick);
    this.playButton.addEventListener('mouseenter', this.onPlayButtonMouseEnter);
    this.playButton.addEventListener('mouseleave', this.onPlayButtonMouseLeave);

    this.playImage.alt = 'Play';
    this.playImage.title = 'Play the plant\'s song';
    this.playImage.src = './images/play-light.svg';

    GameManager.stopPlayer();
  }

  private onStopButtonMouseEnter(): void {
    this.playImage.src = './images/stop-dark.svg';
  }

  private onStopButtonMouseLeave(): void {
    this.playImage.src = './images/stop-light.svg';
  }

  private async playSequence(): Promise<void> {
    if (this.plant !== undefined) {
      await GameManager.playSequence(this.plant.sequence);

      this.playButton.removeEventListener('click', this.onStopButtonClick);
      this.playButton.removeEventListener('mouseenter', this.onStopButtonMouseEnter);
      this.playButton.removeEventListener('mouseleave', this.onStopButtonMouseLeave);
      this.playButton.addEventListener('click', this.onPlayButtonClick);
      this.playButton.addEventListener('mouseenter', this.onPlayButtonMouseEnter);
      this.playButton.addEventListener('mouseleave', this.onPlayButtonMouseLeave);

      this.playImage.alt = 'Play';
      this.playImage.title = 'Play the plant\'s song';
      this.playImage.src = './images/play-light.svg';
    }
  }
}
