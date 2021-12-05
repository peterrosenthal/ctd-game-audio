import * as THREE from 'three';
import * as mm from '@magenta/music/es6';
import GameManager from './GameManager';
import Settings from './Settings';

/**
 * Generates a plant based on a note sequence
 */
export default class Plant {
  private settings: Settings;
  private scene: THREE.Scene;

  private mvae: mm.MusicVAE;

  sequence: mm.INoteSequence;
  object: THREE.Object3D;

  constructor(sequence: mm.INoteSequence) {
    this.settings = Settings.getInstance();
    this.scene = GameManager.getScene();

    this.sequence = sequence;

    this.object = new THREE.Object3D();
    this.scene.add(this.object);

    this.mvae = new mm.MusicVAE(this.settings.generator.checkPointUrl);

    this.generate();
  }

  moveToTheLeft(): void {
    this.object.position.x -= 1;
  }

  removeFromScene(): void {
    this.object.removeFromParent();
  }

  async generate(): Promise<void> {
    await this.mvae.initialize();
    const data = this.reduceDimensions(
      await (await this.mvae.encode([this.sequence])).data(),
      64,
    );

    let [value, index] = this.acquireValueFromData(data, 0);
    const stemThickness = Math.abs((value + 1) * 0.1) + 0.1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemTaper = Math.abs(value * 0.5) % 0.4 + 0.4;
    [value, index] = this.acquireValueFromData(data, index);
    const stemHeight = Math.abs((value + 5) * 0.15) * 2.5 + 0.4;
    [value, index] = this.acquireValueFromData(data, index);
    const stemRadialSeg = Math.ceil(Math.abs(value * 10) + 3);
    [value, index] = this.acquireValueFromData(data, index);
    const stemHeightSeg = Math.ceil(Math.abs(value * 8) + 1);
    [value, index] = this.acquireValueFromData(data, index);
    const stemHue = Math.floor(Math.abs(value * 200) % 360);
    [value, index] = this.acquireValueFromData(data, index);
    const stemSat = Math.floor(Math.abs(value * 100) % 80 + 20);
    [value, index] = this.acquireValueFromData(data, index);
    const stemLit = Math.floor(Math.abs(value * 100) % 60 + 40);
    [value, index] = this.acquireValueFromData(data, index);
    const stemRough = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemMetal = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemReflect = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemClearcoat = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemClearcoatRough = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemLeanAmount = (value / 4) % (0.25 * Math.PI);
    
    const stemGeometry = new THREE.CylinderGeometry(
      stemThickness - (stemThickness * stemTaper),
      stemThickness + (stemThickness * stemTaper),
      stemHeight,
      stemRadialSeg,
      stemHeightSeg,
    );
    const stemMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(`hsl(${stemHue}, ${stemSat}%, ${stemLit}%)`),
      roughness: stemRough,
      metalness: stemMetal,
      reflectivity: stemReflect,
      clearcoat: stemClearcoat,
      clearcoatRoughness: stemClearcoatRough,
      flatShading: false,
      side: THREE.DoubleSide,
    });
    const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    stemMesh.position.y = stemHeight / 2;
    stemMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), stemLeanAmount);
    stemMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.random() * 2 * Math.PI);

    this.object.add(stemMesh);

    [value, index] = this.acquireValueFromData(data, index);
    const branchingFactor = Math.abs((value + 2) * 0.2) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const branchThickness = Math.abs((value + 3) * 0.02) + 0.01;
    [value, index] = this.acquireValueFromData(data, index);
    const branchTaper = Math.abs(value * 0.3) % 0.3 + 0.65;
    [value, index] = this.acquireValueFromData(data, index);
    const branchLength = Math.abs((value + 3) * 0.5) * 0.75;
    [value, index] = this.acquireValueFromData(data, index);
    const branchRadialSeg = Math.ceil(Math.abs(value * 10) + 3);
    [value, index] = this.acquireValueFromData(data, index);
    const branchHeightSeg = Math.ceil(Math.abs(value * 8) + 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchHue = Math.floor(Math.abs(value * 200) % 360);
    [value, index] = this.acquireValueFromData(data, index);
    const branchSat = Math.floor(Math.abs(value * 100) % 80 + 20);
    [value, index] = this.acquireValueFromData(data, index);
    const branchLit = Math.floor(Math.abs(value * 100) % 60 + 40);
    [value, index] = this.acquireValueFromData(data, index);
    const branchRough = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const branchMetal = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const branchReflect = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const branchClearcoat = Math.abs(value) % 1;
    [value, index] = this.acquireValueFromData(data, index);
    const branchClearcoatRough = Math.abs(value) % 1; // note just for future counting sake, this is the 28th value
  }

  private acquireValueFromData(data: Float32Array, index: number): [number, number] {
    return [data[index], (index + 1) % data.length];
  }

  private reduceDimensions(data: Float32Array | Int32Array | Uint8Array, dimensions: number): Float32Array {
    const reduced = new Float32Array(dimensions);
    for (let i = 0; i < data.length; i++) {
      reduced[i % dimensions] += data[i] / Math.ceil((i + 1) / dimensions);
    }
    return reduced;
  }
}
