import * as THREE from 'three';
import SETTINGS from './GameSettings';

export default class Oscinoodle {
  private scene: THREE.Scene;
  position: THREE.Vector3;

  geometry!: THREE.CylinderGeometry;
  material!: THREE.MeshPhysicalMaterial;
  meshes!: THREE.Mesh[];

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.scene = scene;
    this.position = position;
    this.init();
  }

  init(): void {
    this.geometry = new THREE.CylinderGeometry(
      SETTINGS.oscinoodles.radius,
      SETTINGS.oscinoodles.radius,
      1,
      32,
    );
    this.material = new THREE.MeshPhysicalMaterial({
      color: SETTINGS.oscinoodles.color,
    });
    this.meshes = [];

    this.pushSegment();
  }

  pushSegment(): void {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.scale.y = SETTINGS.oscinoodles.segmentHeight;
    mesh.position.copy(this.position);
    mesh.position.y = this.meshes.length * SETTINGS.oscinoodles.segmentHeight;
    this.meshes.push(mesh);
    this.scene.add(mesh);
  }

  popSegment(): void {
    const mesh = this.meshes.pop();
    mesh?.removeFromParent();
  }

  setHeight(height: number): void {
    const numSegments = Math.min(Math.max(Math.floor(height /
          SETTINGS.oscinoodles.segmentHeight),
        SETTINGS.oscinoodles.minSegments),
      SETTINGS.oscinoodles.maxSegments,
    );
    let diff = numSegments - this.meshes.length;
    while (diff > 0) {
      this.pushSegment();
      diff = numSegments - this.meshes.length;
    }
    while (diff < 0) {
      this.popSegment();
      diff = numSegments - this.meshes.length;
    }
  }
}
