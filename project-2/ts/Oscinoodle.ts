import * as THREE from 'three';
import { Vector3 } from 'three';
import SETTINGS from './GameSettings';

export default class Oscinoodle {
  private scene: THREE.Scene;
  position: THREE.Vector3;

  geometry!: THREE.CylinderGeometry;
  material!: THREE.MeshPhysicalMaterial;
  meshes!: THREE.Mesh[];

  swingPlane!: THREE.Vector3;
  maxSwingAngle!: number;
  maxSwingDisplacement!: number;
  swingPeriod!: number;
  swingDistance!: number;

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

    this.setSwing(new Vector3(), 0, 0);

    this.pushSegment();
  }

  pushSegment(): void {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.scale.y = SETTINGS.oscinoodles.segmentHeight;
    mesh.position.copy(this.position);
    mesh.position.y = this.position.y + this.meshes.length * SETTINGS.oscinoodles.segmentHeight;
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

  setSwing(plane: THREE.Vector3, angle: number, distance: number): void {
    this.swingPlane = plane;
    this.maxSwingAngle = angle;
    this.maxSwingDisplacement = 0.55 * angle * Math.sqrt(Math.sqrt(distance));
    this.swingPeriod = this.maxSwingDisplacement * this.meshes.length / 2;
    this.swingDistance = distance;
    this.swing(this.maxSwingAngle);
  }

  swing(angle: number): void {
    let displacement = 0.55 * angle * Math.sqrt(Math.sqrt(this.swingDistance));
    let theta = Math.atan(this.swingPlane.z / this.swingPlane.x);
    if (this.swingPlane.x <= 0) {
      theta += Math.PI;
    }
    if (this.swingPlane.x >= 0 && this.swingPlane.z <= 0) {
      theta += 2 * Math.PI;
    }
    // console.log(`theta: ${theta}, plane.x: ${plane.x}, plane.z: ${plane.z}, angle: ${angle}`);
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];
      mesh.position.set(
        this.position.x + (i / this.meshes.length) * (i / this.meshes.length) * displacement * Math.cos(theta),
        this.position.y + i * SETTINGS.oscinoodles.segmentHeight * Math.cos(Math.sign(angle) * Math.sqrt(Math.abs(angle / 2))),
        this.position.z + (i / this.meshes.length) * (i / this.meshes.length) * displacement * Math.sin(theta),
      );
      mesh.rotation.y = 2 * Math.PI - theta;
      mesh.rotation.z = -angle * (i / this.meshes.length);
    }
  }
}
