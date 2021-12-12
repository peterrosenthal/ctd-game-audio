import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import GameManager from '../GameManager';
import Lights from '../Lights';
import Settings from './Settings';
import Skybox from '../Skybox';
import Component from './Component';
import Plant from '../Plant';
import { delay } from '../utils';
import MidiUpload from './MidiUpload';
import Combinator from './Combinator';
import InventoryItem from './InventoryItem';

export default class Parent extends Component {
  private settings: Settings;

  private canvas: HTMLCanvasElement;
  private buttons: HTMLDivElement;
  private inventoryButton: HTMLButtonElement;
  private inventoryImage: HTMLImageElement;
  private playButton: HTMLButtonElement;
  private playImage: HTMLImageElement;
  private inventory: HTMLDivElement;
  private inventoryItems: InventoryItem[];

  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;

  combinator: Combinator;
  plant?: Plant;

  constructor(combinator: Combinator) {
    super();

    this.combinator = combinator;

    // initialize the inventory items array 
    this.inventoryItems = [];
    const plants = GameManager.getPlants();
    for (let plant of plants) {
      const item = new InventoryItem(this);
      item.setPlant(plant);
      this.inventoryItems.push(item);
    }

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

    // create the modal inventory
    this.inventory = document.createElement('div');
    this.inventory.style.display = 'flex';
    this.inventory.style.flexFlow = 'row wrap';
    this.inventory.style.alignItems = 'center';
    this.inventory.style.justifyContent = 'space-around';
    this.inventory.style.position = 'absolute';
    this.inventory.style.top = '0';
    this.inventory.style.zIndex = '150';
    this.inventory.style.width = '95%';
    this.inventory.style.height = '85%';
    this.inventory.style.margin = '2.5%';
    this.inventory.style.background = '#f0f0ef';
    this.inventory.style.borderRadius = '0.2em';
    this.element.appendChild(this.inventory);

    // init the midiupload component
    const midiUpload = new MidiUpload(this);
    midiUpload.initComponentToParent(this.inventory);
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
    if (this.inventory.style.display !== 'none') {
      this.inventoryButton.click();
    }
    this.plant?.removeFromScene();
    this.plant = plant;
    if (this.scene !== undefined) {
      this.plant.addToScene(this.scene);
    }
    if (this.inventory.style.display !== 'none') {
      this.inventory.style.display = 'none';
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
    const plants = GameManager.getPlants();
    while (this.inventoryItems.length > plants.length) {
      this.inventoryItems.pop()?.removeComponent();
    }
    for (let i = 0; i < plants.length; i++) {
      const item = i < this.inventoryItems.length ? this.inventoryItems[i] : new InventoryItem(this);
      item.initComponentToParent(this.inventory);
      item.setPlant(plants[i]);
      if (i >= this.inventoryItems.length) {
        this.inventoryItems.push(item);
      }
    }

    this.inventory.style.display = 'flex';

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
    for (let item of this.inventoryItems) {
      item.removeComponent();
    }
    if (this.combinator.parentA.plant !== undefined) {
      this.combinator.parentA.setPlant(this.combinator.parentA.plant);
    }
    if (this.combinator.parentB.plant !== undefined) {
      this.combinator.parentB.setPlant(this.combinator.parentB.plant);
    }

    this.inventory.style.display = 'none';

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
    this.inventory.style.display = 'none';

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
    this.inventory.style.display = 'none';

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
