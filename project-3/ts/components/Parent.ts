import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import GameManager from '../GameManager';
import Lights from '../Lights';
import Settings from '../Settings';
import Skybox from '../Skybox';
import Component from './Component';
import Plant from '../Plant';
import { delay } from '../utils';
import MidiUpload from './MidiUpload';
import Combinator from './Combinator';

export default class Parent extends Component {
  private settings: Settings;

  private canvas: HTMLCanvasElement;
  private buttons: HTMLDivElement;
  private inventoryButton: HTMLButtonElement;
  private inventoryImage: HTMLImageElement;
  private playButton: HTMLButtonElement;
  private playImage: HTMLImageElement;
  private modal: HTMLDivElement;

  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;

  combinator: Combinator;
  plant?: Plant;

  constructor(combinator: Combinator) {
    super();

    this.combinator = combinator;

    // get Settings instance
    this.settings = Settings.getInstance();

    // bind animate and event listeners
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onOpenInventoryButtonClick = this.onOpenInventoryButtonClick.bind(this);
    this.onOpenInventoryButtonMouseEnter = this.onOpenInventoryButtonMouseEnter.bind(this);
    this.onOpenInventoryButtonMouseLeave = this.onOpenInventoryButtonMouseLeave.bind(this);
    this.onCloseInventoryButtonClick = this.onCloseInventoryButtonClick.bind(this);
    this.onCloseInventoryButtonMouseEnter = this.onCloseInventoryButtonMouseEnter.bind(this);
    this.onCloseInventoryButtonMouseLeave = this.onCloseInventoryButtonMouseLeave.bind(this);
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
    this.element.style.position = 'relative';
    this.element.style.width = '40%';
    this.element.style.minWidth = '13em';
    this.element.style.maxWidth = '16em';
    this.element.style.margin = '0.5em';
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
   
    // open inventory button
    this.inventoryButton = document.createElement('button');
    this.inventoryButton.style.background = 'none';
    this.inventoryButton.style.border = 'none';
    this.inventoryButton.addEventListener('click', this.onCloseInventoryButtonClick);
    this.inventoryButton.addEventListener('mouseenter', this.onCloseInventoryButtonMouseEnter);
    this.inventoryButton.addEventListener('mouseleave', this.onCloseInventoryButtonMouseLeave);
    this.buttons.appendChild(this.inventoryButton);
    this.inventoryImage = document.createElement('img');
    this.inventoryImage.alt = 'Close inventory';
    this.inventoryImage.title = 'Close plant inventory';
    this.inventoryImage.src = './images/close-inventory-light.svg';
    this.inventoryButton.appendChild(this.inventoryImage);

    // play button
    this.playButton = document.createElement('button');
    this.playButton.style.background = 'none';
    this.playButton.style.border = 'none';
    this.playButton.addEventListener('click', this.onPlayButtonClick);
    this.playButton.addEventListener('mouseenter', this.onPlayButtonMouseEnter);
    this.playButton.addEventListener('mouseleave', this.onPlayButtonMouseLeave);
    this.playImage = document.createElement('img');
    this.playImage.alt = 'Play';
    this.playImage.title = 'Play the plant\'s song';
    this.playImage.src = './images/play-light.svg';
    this.playButton.appendChild(this.playImage);

    // create the modal element
    this.modal = document.createElement('div');
    this.modal.style.display = 'flex';
    this.modal.style.flexFlow = 'row';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'center safe';
    this.modal.style.position = 'absolute';
    this.modal.style.top = '0';
    this.modal.style.zIndex = '2';
    this.modal.style.width = '80%';
    this.modal.style.height = '72.5%';
    this.modal.style.margin = '10%';
    this.modal.style.background = '#f0f0ef';
    this.modal.style.borderRadius = '0.2em';
    this.element.appendChild(this.modal);

    // init the midiupload component
    const midiUpload = new MidiUpload(this);
    midiUpload.initComponentToParent(this.modal);
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
    if (this.buttons.childElementCount < 2) {
      this.buttons.appendChild(this.playButton);
    }
    if (this.modal.style.display !== 'none') {
      this.inventoryButton.click();
    }
    this.plant?.removeFromScene();
    this.plant = plant;
    if (this.scene !== undefined) {
      this.plant.addToScene(this.scene);
    }
    if (this.modal.style.display !== 'none') {
      this.modal.style.display = 'none';
    }
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

  private onOpenInventoryButtonClick(): void {
    this.modal.style.display = 'flex';

    this.inventoryButton.removeEventListener('click', this.onOpenInventoryButtonClick);
    this.inventoryButton.removeEventListener('mouseenter', this.onOpenInventoryButtonMouseEnter);
    this.inventoryButton.removeEventListener('mouseleave', this.onOpenInventoryButtonMouseLeave);
    this.inventoryButton.addEventListener('click', this.onCloseInventoryButtonClick);
    this.inventoryButton.addEventListener('mouseenter', this.onCloseInventoryButtonMouseEnter);
    this.inventoryButton.addEventListener('mouseleave', this.onCloseInventoryButtonMouseLeave);

    this.inventoryImage.alt = 'Close inventory';
    this.inventoryImage.title = 'Close plant inventory';
    this.inventoryImage.src = './images/close-inventory-light.svg';
  }

  private onOpenInventoryButtonMouseEnter(): void {
    this.inventoryImage.src = './images/open-inventory-dark.svg';
  }

  private onOpenInventoryButtonMouseLeave(): void {
    this.inventoryImage.src = './images/open-inventory-light.svg';
  }

  private onCloseInventoryButtonClick(): void {
    this.modal.style.display = 'none';

    this.inventoryButton.removeEventListener('click', this.onCloseInventoryButtonClick);
    this.inventoryButton.removeEventListener('mouseenter', this.onCloseInventoryButtonMouseEnter);
    this.inventoryButton.removeEventListener('mouseleave', this.onCloseInventoryButtonMouseLeave);
    this.inventoryButton.addEventListener('click', this.onOpenInventoryButtonClick);
    this.inventoryButton.addEventListener('mouseenter', this.onOpenInventoryButtonMouseEnter);
    this.inventoryButton.addEventListener('mouseleave', this.onOpenInventoryButtonMouseLeave);

    this.inventoryImage.alt = 'Open inventory';
    this.inventoryImage.title = 'Open plant inventory';
    this.inventoryImage.src = './images/open-inventory-light.svg';
  }

  private onCloseInventoryButtonMouseEnter(): void {
    this.inventoryImage.src = './images/close-inventory-dark.svg';
  }

  private onCloseInventoryButtonMouseLeave(): void {
    this.inventoryImage.src = './images/close-inventory-light.svg';
  }

  private onPlayButtonClick(): void {
    this.modal.style.display = 'none';

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
    this.modal.style.display = 'none';

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
