import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Component from './Component';
import Lights from '../Lights';
import Parent from './Parent';
import Plant from '../Plant';
import Settings from './Settings';
import Skybox from '../Skybox';
import { delay } from '../utils';

export default class InventoryItem extends Component {
  private settings: Settings;

  private canvas: HTMLCanvasElement;

  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;

  parent: Parent;
  plant?: Plant;

  constructor(parent: Parent) {
    super();

    this.parent = parent;

    // get Settings instance
    this.settings = Settings.getInstance();

    // bind animate and event listeners
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onClick = this.onClick.bind(this);

    // add window resize event listener
    window.addEventListener('resize', this.onWindowResize);

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '25%';
    this.element.style.minWidth = '3em';
    this.element.style.maxWidth = '7em';
    this.element.style.flexBasis = '1';
    this.element.addEventListener('click', this.onClick);

    // create the canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.margin = '0';
    this.canvas.style.border = '1px solid #8ab1b4';
    this.canvas.style.borderRadius = '0.2em';
    this.element.appendChild(this.canvas);
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

  private onClick(): void {
    if (this.plant === undefined) {
      return;
    }
    this.parent.setPlant(this.plant);
  }
}
