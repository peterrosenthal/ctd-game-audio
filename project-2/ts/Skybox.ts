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
    this.textureLoaded = this.textureLoaded.bind(this);

    // rest of object initialization
    this.init();
  }

  init(): void {
    this.texture = new THREE.TextureLoader().load(
      '../img/skybox.png',
      this.textureLoaded,
      undefined,
      (error) => { console.log(error); },
    );
  }

  textureLoaded(): void {
    const renderTarget = new THREE.WebGLCubeRenderTarget(this.texture.image.height);
    renderTarget.fromEquirectangularTexture(this.renderer, this.texture);
    this.scene.background = renderTarget.texture;
  }
}
