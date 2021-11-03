import * as THREE from 'three';
import SETTINGS from './GameSettings';

export default class Oscinoodle {
  private scene: THREE.Scene;
  private listener: THREE.AudioListener;
  position: THREE.Vector3;

  geometry!: THREE.CylinderGeometry;
  material!: THREE.MeshPhysicalMaterial;
  meshes!: THREE.Mesh[];

  eyes!: THREE.Mesh[];
  pupils!: THREE.Mesh[];
  mouth!: THREE.Mesh;

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
      SETTINGS.oscinoodles.segmentHeight,
      32,
    );
    this.material = new THREE.MeshPhysicalMaterial({
      color: SETTINGS.oscinoodles.colors[Math.floor(Math.random() * SETTINGS.oscinoodles.colors.length)],
    });

    this.meshes = [];
    this.eyes = [];
    this.pupils = [];

    const sphere = new THREE.SphereGeometry();
    const eyeWhite = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
    this.eyes.push(new THREE.Mesh(sphere, eyeWhite));
    this.eyes.push(new THREE.Mesh(sphere, eyeWhite));
    this.eyes[0].position.set(0.08, -0.05, -0.125);
    this.eyes[0].scale.set(0.1, 0.1, 0.1);
    this.eyes[1].position.set(-0.08, -0.05, -0.125);
    this.eyes[1].scale.set(0.1, 0.1, 0.1);

    const eyeBlack = new THREE.MeshPhysicalMaterial({ color: 0x000000 });
    this.pupils.push(new THREE.Mesh(sphere, eyeBlack));
    this.pupils.push(new THREE.Mesh(sphere, eyeBlack));
    this.pupils[0].position.set(0.2, 0, -0.5);
    this.pupils[0].scale.set(0.5, 0.5, 0.5);
    this.eyes[0].add(this.pupils[0]);
    this.pupils[1].position.set(-0.2, 0, -0.5);
    this.pupils[1].scale.set(0.5, 0.5, 0.5);
    this.eyes[1].add(this.pupils[1]);

    const cylinder = new THREE.CylinderGeometry(
      SETTINGS.oscinoodles.mouthSize,
      SETTINGS.oscinoodles.mouthSize,
      0.01,
      16,
    );
    const mouthBlack = new THREE.MeshPhysicalMaterial({ color: 0x1a0b10 });
    this.mouth = new THREE.Mesh(cylinder, mouthBlack);
    this.mouth.position.set(0, -SETTINGS.oscinoodles.segmentHeight, -SETTINGS.oscinoodles.radius);
    this.mouth.rotation.x = -Math.PI / 2;

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
    if (this.mouth.scale.x > 1 || this.mouth.scale.z > 1) {
      this.mouth.scale.x -= this.mouth.scale.x * delta * SETTINGS.oscinoodles.mouthSpeed;
      this.mouth.scale.z -= this.mouth.scale.z * delta * SETTINGS.oscinoodles.mouthSpeed;
    }
    if (this.maxSwingDisplacement !== 0) {
      let t = this.swingTime % (this.swingPeriod * 2);
      if (t > 0 && t < this.swingPeriod && !this.firstNoteTriggered) {
        if (this.sound.isPlaying) {
          this.sound.stop();
        }
        this.sound.play();
        this.firstNoteTriggered = true;
        this.secondNoteTriggered = false;
        this.mouth.scale.set(
          SETTINGS.oscinoodles.mouthGrow,
          1,
          SETTINGS.oscinoodles.mouthGrow,
        );
      }
      if (t > this.swingPeriod) {
        if (!this.secondNoteTriggered) {
          if (this.sound.isPlaying) {
            this.sound.stop();
          }
          this.sound.play();
          this.secondNoteTriggered = true;
          this.firstNoteTriggered = false;
          this.mouth.scale.set(
            SETTINGS.oscinoodles.mouthGrow,
            1,
            SETTINGS.oscinoodles.mouthGrow,
          );
        }
        t = 2 * this.swingPeriod - t;
      }
      t /= this.swingPeriod;
      this.swing(THREE.MathUtils.lerp(this.maxSwingDisplacement, -this.maxSwingDisplacement, t));
      this.swingTime += delta;
    }
    if (this.mouth.scale.x < 1) {
      this.mouth.scale.x = 1;
    }
    if (this.mouth.scale.z < 1) {
      this.mouth.scale.z = 1;
    }
  }

  pushSegment(): void {
    this.setSwing(new THREE.Vector3(1, 1, 1), 0);

    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.copy(this.position);
    mesh.position.y = this.position.y + this.meshes.length * SETTINGS.oscinoodles.segmentHeight;
    this.meshes.push(mesh);
    this.scene.add(mesh);

    for (const eye of this.eyes) {
      eye.removeFromParent();
      mesh.add(eye);
    }
    this.mouth.removeFromParent();
    mesh.add(this.mouth);

    this.setSoundFileOffset();
  }

  popSegment(): void {
    for (const eye of this.eyes) {
      eye.removeFromParent();
    }
    this.mouth.removeFromParent();
    const mesh = this.meshes.pop();
    mesh?.removeFromParent();
    for (const eye of this.eyes) {
      this.meshes[this.meshes.length - 1].add(eye);
    }
    this.meshes[this.meshes.length - 1].add(this.mouth);

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
