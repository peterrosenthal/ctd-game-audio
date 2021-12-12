import { Scene, Object3D, Mesh, MeshPhysicalMaterial, CylinderGeometry, Color, DoubleSide, Vector3 } from 'three';
import { INoteSequence, MusicVAE } from '@magenta/music/es6';
import Settings from './components/Settings';
import { rampUpDownMod } from './utils';

/**
 * Generates a plant based on a note sequence
 */
export default class Plant {
  private settings: Settings;

  sequence: INoteSequence;
  object: Object3D;

  constructor(sequence: INoteSequence) {
    this.settings = Settings.getInstance();

    this.sequence = sequence;

    this.object = new Object3D();

    this.generate();
  }

  addToScene(scene: Scene) {
    scene.add(this.object);
  }

  removeFromScene() {
    this.object.removeFromParent();
  }

  moveToTheLeft(): void {
    this.object.position.x -= 1;
  }

  async generate(): Promise<void> {
    const mvae = new MusicVAE(this.settings.generator.checkpointUrl);
    await mvae.initialize();
    const data = this.reduceDimensions(
      await (await mvae.encode([this.sequence])).data(),
      64,
    );

    let [value, index] = this.acquireValueFromData(data, 0);
    const stemThickness = Math.abs((value + 1) * 0.1) + 0.1;
    [value, index] = this.acquireValueFromData(data, index);
    const stemTaper = rampUpDownMod(Math.abs(value * 0.5), 0.4) + 0.4;
    [value, index] = this.acquireValueFromData(data, index);
    const stemHeight = Math.abs((value + 5) * 0.15) * 2.5 + 0.4;
    [value, index] = this.acquireValueFromData(data, index);
    const stemRadialSeg = Math.ceil(Math.abs(value * 10) + 3);
    [value, index] = this.acquireValueFromData(data, index);
    const stemHeightSeg = Math.ceil(Math.abs(value * 8) + 1);
    [value, index] = this.acquireValueFromData(data, index);
    const stemHue = Math.floor(Math.abs(value * 200) % 360);
    [value, index] = this.acquireValueFromData(data, index);
    const stemSat = Math.floor(rampUpDownMod(Math.abs(value * 100), 20) + 80);
    [value, index] = this.acquireValueFromData(data, index);
    const stemLit = Math.floor(rampUpDownMod(Math.abs(value * 100), 35) + 45);
    [value, index] = this.acquireValueFromData(data, index);
    const stemRough = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const stemMetal = rampUpDownMod(Math.abs(value) * 0.1, 0.2);
    [value, index] = this.acquireValueFromData(data, index);
    const stemReflect = rampUpDownMod(Math.abs(value), 0.9);
    [value, index] = this.acquireValueFromData(data, index);
    const stemClearcoat = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const stemClearcoatRough = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const stemLeanAmount = rampUpDownMod(value / 4, 0.25 * Math.PI);
    
    const stemGeometry = new CylinderGeometry(
      stemThickness - (stemThickness * stemTaper),
      stemThickness + (stemThickness * stemTaper),
      stemHeight,
      stemRadialSeg,
      stemHeightSeg,
    );
    const stemMaterial = new MeshPhysicalMaterial({
      color: new Color(`hsl(${stemHue}, ${stemSat}%, ${stemLit}%)`),
      roughness: stemRough,
      metalness: stemMetal,
      reflectivity: stemReflect,
      clearcoat: stemClearcoat,
      clearcoatRoughness: stemClearcoatRough,
      flatShading: false,
      side: DoubleSide,
    });
    const stemMesh = new Mesh(stemGeometry, stemMaterial);
    stemMesh.position.y = stemHeight / 2;
    stemMesh.rotateOnWorldAxis(new Vector3(1, 0, 0), stemLeanAmount);
    stemMesh.rotateOnWorldAxis(new Vector3(0, 1, 0), Math.random() * 2 * Math.PI);

    this.object.add(stemMesh);

    [value, index] = this.acquireValueFromData(data, index);
    const branchingRadialFactor = rampUpDownMod(Math.abs((value + 1.4) * 0.8) , 3 * Math.PI) + Math.PI;
    [value, index] = this.acquireValueFromData(data, index);
    const branchingHeightFactor = rampUpDownMod(Math.abs((value + 2) * 0.2), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchSplay = rampUpDownMod(Math.abs(value * 0.8), 0.35 * Math.PI);
    [value, index] = this.acquireValueFromData(data, index);
    const branchThickness = Math.abs((value + 3) * 0.02) + 0.01;
    [value, index] = this.acquireValueFromData(data, index);
    const branchTaper = rampUpDownMod(Math.abs(value * 0.3), 0.3) + 0.65;
    [value, index] = this.acquireValueFromData(data, index);
    const branchLength = Math.abs((value + 3) * 0.5) * 0.75;
    [value, index] = this.acquireValueFromData(data, index);
    const branchRadialSeg = Math.ceil(Math.abs(value * 10) + 3);
    [value, index] = this.acquireValueFromData(data, index);
    const branchHeightSeg = Math.ceil(Math.abs(value * 8) + 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchHue = Math.floor(Math.abs(value * 200) % 360);
    [value, index] = this.acquireValueFromData(data, index);
    const branchSat = Math.floor(rampUpDownMod(Math.abs(value * 100), 80) + 20);
    [value, index] = this.acquireValueFromData(data, index);
    const branchLit = Math.floor(rampUpDownMod(Math.abs(value * 100), 60) + 40);
    [value, index] = this.acquireValueFromData(data, index);
    const branchRough = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchMetal = rampUpDownMod(Math.abs(value * 0.1), 0.25);
    [value, index] = this.acquireValueFromData(data, index);
    const branchReflect = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchClearcoat = rampUpDownMod(Math.abs(value), 1);
    [value, index] = this.acquireValueFromData(data, index);
    const branchClearcoatRough = rampUpDownMod(Math.abs(value), 1); // note just for future counting sake, this is the 28th value

    const branchGeometry = new CylinderGeometry(
      branchThickness - (branchThickness * branchTaper),
      branchThickness + (branchThickness * branchTaper),
      branchLength,
      branchRadialSeg,
      branchHeightSeg,
    );
    const branchMaterial = new MeshPhysicalMaterial({
      color: new Color(`hsl(${branchHue}, ${branchSat}%, ${branchLit}%)`),
      roughness: branchRough,
      metalness: branchMetal,
      reflectivity: branchReflect,
      clearcoat: branchClearcoat,
      clearcoatRoughness: branchClearcoatRough,
      flatShading: false,
      side: DoubleSide,
    });

    for (
      let branchHeight = branchingHeightFactor, branchRotation = branchingRadialFactor;
      branchHeight < stemHeight;
      branchHeight += branchingHeightFactor, branchRotation += branchingRadialFactor
    ) {
      const scale = (stemHeight - branchHeight) / stemHeight;
      const branchMesh = new Mesh(branchGeometry, branchMaterial);
      branchMesh.position.y = branchLength / 2 - stemHeight / 2;
      branchMesh.position.x = Math.sin(branchSplay) * 0.75 * Math.sin(branchRotation) * scale;
      branchMesh.position.z = Math.sin(branchSplay) * 0.75 * Math.cos(branchRotation) * scale;
      branchMesh.rotateOnWorldAxis(new Vector3(1, 0, 0), branchSplay);
      branchMesh.rotateOnWorldAxis(new Vector3(0, 1, 0), branchRotation);
      branchMesh.position.y = (branchHeight + branchLength / 2 - stemHeight / 2) * (scale * 0.3 + 0.7);
      branchMesh.scale.set(scale, scale, scale);
      stemMesh.add(branchMesh);
    }
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
