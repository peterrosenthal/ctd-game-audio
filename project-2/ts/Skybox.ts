import * as THREE from 'three';

export default class Skybox {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;

  texture!: THREE.Texture;

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    // asign private members
    this.scene = scene;
    this.renderer = renderer;

    // bind event functions
    this.onTextureLoaded = this.onTextureLoaded.bind(this);

    // rest of object initialization
    this.init();
  }

  init(): void {
    this.texture = new THREE.TextureLoader().load(
      '../textures/skybox.png',
      this.onTextureLoaded,
      undefined,
      (error) => { console.error(error); },
    );
  }

  onTextureLoaded(): void {
    const renderTarget = new THREE.WebGLCubeRenderTarget(this.texture.image.height);
    renderTarget.fromEquirectangularTexture(this.renderer, this.texture);
    this.scene.background = renderTarget.texture;
  }
}
