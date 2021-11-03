import * as THREE from 'three';
import SETTINGS from './GameSettings';

export default class Oscinoodle {
  private scene: THREE.Scene;
  private listener: THREE.AudioListener;
  position: THREE.Vector3;

  geometry!: THREE.CylinderGeometry;
  material!: THREE.MeshPhysicalMaterial;
  meshes!: THREE.Mesh[];

  swingPlane!: THREE.Vector3;
  maxSwingDisplacement!: number;
  swingPeriod!: number;
  swingTime!: number;

  sound!: THREE.PositionalAudio;
  firstNoteTriggered!: boolean;
  secondNoteTriggered!: boolean;

  constructor(
    scene: THREE.Scene,
    listener: THREE.AudioListener,
    position: THREE.Vector3) {
    // assign private members
    this.scene = scene;
    this.listener = listener;
    this.position = position;

    // bind event functions
    this.audioLoaded = this.audioLoaded.bind(this);

    // rest of object initialization
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
      color: SETTINGS.oscinoodles.colors[Math.floor(Math.random() * SETTINGS.oscinoodles.colors.length)],
    });

    this.meshes = [];

    this.sound = new THREE.PositionalAudio(this.listener);
    this.firstNoteTriggered = false;
    this.secondNoteTriggered = false;
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      '../audio/notes.wav',
      this.audioLoaded,
      undefined,
      (error) => { console.log(error); },
    );

    this.pushSegment();
    this.meshes[0].add(this.sound);
  }

  update(delta: number): void {
    if (this.maxSwingDisplacement !== 0) {
      let t = this.swingTime % (this.swingPeriod * 2);
      if (t > 0 && t < this.swingPeriod && !this.firstNoteTriggered) {
        if (this.sound.isPlaying) {
          this.sound.stop();
        }
        this.sound.play();
        this.firstNoteTriggered = true;
        this.secondNoteTriggered = false;
      }
      if (t > this.swingPeriod) {
        if (!this.secondNoteTriggered) {
          if (this.sound.isPlaying) {
            this.sound.stop();
          }
          this.sound.play();
          this.secondNoteTriggered = true;
          this.firstNoteTriggered = false;
        }
        t = 2 * this.swingPeriod - t;
      }
      t /= this.swingPeriod;
      this.swing(THREE.MathUtils.lerp(this.maxSwingDisplacement, -this.maxSwingDisplacement, t));
      this.swingTime += delta;
    }
  }

  pushSegment(): void {
    this.setSwing(new THREE.Vector3(1, 1, 1), 0);

    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.scale.y = SETTINGS.oscinoodles.segmentHeight;
    mesh.position.copy(this.position);
    mesh.position.y = this.position.y + this.meshes.length * SETTINGS.oscinoodles.segmentHeight;
    this.meshes.push(mesh);
    this.scene.add(mesh);

    this.setSoundFileOffset();
  }

  popSegment(): void {
    const mesh = this.meshes.pop();
    mesh?.removeFromParent();

    this.setSoundFileOffset();
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

  setSwing(plane: THREE.Vector3, displacement: number): void {
    this.swingPlane = plane;
    this.maxSwingDisplacement = displacement;
    this.swingPeriod = Math.abs(this.maxSwingDisplacement * Math.sqrt(this.meshes.length) / 3);
    this.swingTime = 0;
    this.swing(this.maxSwingDisplacement);
  }

  swing(displacement: number): void {
    let theta = Math.atan(this.swingPlane.z / this.swingPlane.x);
    if (this.swingPlane.x <= 0) {
      theta += Math.PI;
    }
    if (this.swingPlane.x > 0 && this.swingPlane.z <= 0) {
      theta += 2 * Math.PI;
    }
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];
      mesh.position.set(
        this.position.x + (i / this.meshes.length) * (i / this.meshes.length) * displacement * Math.cos(theta),
        this.position.y + i * SETTINGS.oscinoodles.segmentHeight - (i / this.meshes.length) * (i / this.meshes.length) * Math.abs(displacement) / 2,
        this.position.z + (i / this.meshes.length) * (i / this.meshes.length) * displacement * Math.sin(theta),
      );
      mesh.rotation.y = 2 * Math.PI - theta;
      if (i > 0) {
        mesh.rotation.z = -Math.atan((((i / this.meshes.length) * (i / this.meshes.length) -
          ((i - 1) / this.meshes.length) * ((i - 1) / this.meshes.length)) * displacement) /
          (i / this.meshes.length - (i - 1) / this.meshes.length)) / 1.5;
      }
    }
  }

  setSoundFileOffset() {
    this.sound.offset = SETTINGS.oscinoodles.maxSegments + 1 - this.meshes.length;
  }
  
  audioLoaded(buffer: AudioBuffer) {
    this.sound.setBuffer(buffer);
    this.setSoundFileOffset();
    this.sound.duration = 0.75;
    this.sound.setRefDistance(SETTINGS.oscinoodles.positionalAudio.refDistance);
    this.sound.setDistanceModel('exponential');
  }
}
