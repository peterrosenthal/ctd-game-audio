import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import Lights from '../Lights';
import Settings from '../Settings';
import Skybox from '../Skybox';
import Component from './Component';
import { delay } from '../utils';
import Plant from '../Plant';
import { TWINKLE_FIRST_HALF } from '../sequences';

export default class Parent extends Component {
  private settings: Settings;

  private canvas: HTMLCanvasElement;
  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;

  constructor() {
    super();

    // get Settings instance
    this.settings = Settings.getInstance();

    // bind event listeners
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);

    // add window resize event listener
    window.addEventListener('resize', this.onWindowResize);

    // create the component container element
    this.element = document.createElement('div');
    this.element.style.width = '40%';
    this.element.style.minWidth = '16em';
    this.element.style.margin = '0.5em';
    this.element.style.padding = '0';

    // create the canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.margin = '0';
    this.canvas.style.borderRadius = '0.2em';
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
      this.element.appendChild(this.renderer.domElement);
      this.resizeCanvasDelay();
    }

    // create the THREE skybox and lights
    new Skybox(this.scene, this.renderer);
    new Lights(this.scene);

    // create a demo plant
    const plant = new Plant(TWINKLE_FIRST_HALF);
    plant.addToScene(this.scene);

    // start animation loop
    requestAnimationFrame(this.animate);
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

  private onWindowResize(): void {
    this.resizeCanvas();
  }

  private async resizeCanvasDelay(): Promise<void> {
    await delay(3);
    this.resizeCanvas();
  }
}
