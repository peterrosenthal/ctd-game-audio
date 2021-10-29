import * as THREE from 'three';

export default class BouncyBoi {
  private scene: THREE.Scene;
  private position: THREE.Vector3;

  mesh!: THREE.Mesh;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.scene = scene;
    this.position = position;
    this.init();
  }

  init(): void {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshPhysicalMaterial({ color: 0xef33ba });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  setHeight(height: number): void {
    this.mesh.scale.y = height;
  }
}
