import * as THREE from 'three';
import GameManager from './GameManager';

export default class Skybox {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  texture: THREE.Texture;

  constructor() {
    // asign private members
    this.scene = GameManager.getScene();
    this.renderer = GameManager.getRenderer();

    // bind event functions
    this.onTextureLoaded = this.onTextureLoaded.bind(this);

    // skybox texture
    this.texture = new THREE.TextureLoader().load(
      '../textures/skybox.png',
      this.onTextureLoaded,
      undefined,
      (error) => { console.error(error); },
    );
  }

  init(): void {
  }

  onTextureLoaded(): void {
    const renderTarget = new THREE.WebGLCubeRenderTarget(this.texture.image.height);
    renderTarget.fromEquirectangularTexture(this.renderer, this.texture);
    this.scene.background = renderTarget.texture;
  }
}
