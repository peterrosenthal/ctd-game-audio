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
  maxSwingAngle!: number;
  maxSwingDisplacement!: number;
  swingPeriod!: number;
  swingDistance!: number;
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
      color: SETTINGS.oscinoodles.color,
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
    if (this.maxSwingAngle !== 0) {
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
      this.swing(THREE.MathUtils.lerp(this.maxSwingAngle, -this.maxSwingAngle, t));
      this.swingTime += delta;
    }
  }

  pushSegment(): void {
    this.setSwing(new THREE.Vector3(1, 1, 1), 0, 1);

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

  setSwing(plane: THREE.Vector3, angle: number, distance: number): void {
    this.swingPlane = plane;
    this.maxSwingAngle = angle;
    this.maxSwingDisplacement = 0.55 * angle * Math.sqrt(Math.sqrt(distance));
    this.swingPeriod = Math.abs(this.maxSwingDisplacement * this.meshes.length / 3);
    this.swingDistance = distance;
    this.swingTime = 0;
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
