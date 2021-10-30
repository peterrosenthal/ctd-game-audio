import * as THREE from 'three';
import SETTINGS from './GameSettings';

export default class Oscinoodle {
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
    const material = new THREE.MeshPhysicalMaterial({ color: SETTINGS.oscinoodles.color });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);
  }

  setHeight(height: number): void {
    const numSegments = Math.min(Math.max(Math.floor(height /
          SETTINGS.oscinoodles.segmentHeight),
        SETTINGS.oscinoodles.minSegments),
      SETTINGS.oscinoodles.maxSegments,
    );
    this.mesh.scale.y = numSegments * SETTINGS.oscinoodles.segmentHeight;
    this.mesh.position.y = (numSegments * SETTINGS.oscinoodles.segmentHeight) / 2;
  }
}
