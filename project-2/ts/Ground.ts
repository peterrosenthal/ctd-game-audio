import * as THREE from 'three';

export default class Ground {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  texture!: THREE.Texture;
  mesh?: THREE.Mesh;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    // assign private members
    this.scene = scene;
    this.camera = camera;

    // bind event functions
    this.onTextureLoaded = this.onTextureLoaded.bind(this);

    // rest of object initialization
    this.init();
  }

  init(): void {
    this.texture = new THREE.TextureLoader().load(
      '../textures/ground.png',
      this.onTextureLoaded,
      undefined,
      (error) => { console.error(error); },
    );
  }

  scrollTexture(): void {
    this.mesh?.position.set(
      this.camera.position.x,
      0,
      this.camera.position.z,
    );
    this.texture.offset.set(
      this.camera.position.x / 10 * 3,
      -this.camera.position.z / 10 * 3,
    );
  }

  onTextureLoaded(): void {
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.x = 3000;
    this.texture.repeat.y = 3000;

    const geometry = new THREE.PlaneGeometry(10000, 10000);
    const material = new THREE.MeshPhysicalMaterial({
      map: this.texture,
      opacity: 0.1,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, -2, 0);
    this.mesh.rotateX(-Math.PI / 2);

    this.scene.add(this.mesh);
  }
}
