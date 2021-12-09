import { Scene, WebGLRenderer, WebGLCubeRenderTarget, TextureLoader, Texture } from 'three';

export default class Skybox {
  private scene: Scene;
  private renderer: WebGLRenderer;

  texture: Texture;

  constructor(scene: Scene, renderer: WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;

    // bind event functions
    this.onTextureLoaded = this.onTextureLoaded.bind(this);

    // skybox texture
    this.texture = new TextureLoader().load(
      '../textures/skybox.png',
      this.onTextureLoaded,
      undefined,
      (error) => { console.error(error); },
    );
  }

  onTextureLoaded(): void {
    const renderTarget = new WebGLCubeRenderTarget(this.texture.image.height);
    renderTarget.fromEquirectangularTexture(this.renderer, this.texture);
    this.scene.background = renderTarget.texture;
  }
}
