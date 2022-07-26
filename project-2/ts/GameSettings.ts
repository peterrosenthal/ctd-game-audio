const SETTINGS = {
  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    position: {
      x: 0,
      y: 2,
      z: 0,
    },
    lookAt: {
      x: 0,
      y: 0,
      z: -10,
    },
  },
  lights: {
    directional: {
      color: 0xffffff,
      intensity: 0.5,
      position: {
        x: -4,
        y: 5,
        z: 2,
      },
    },
    ambient: {
      color: 0xffffff,
      intensity: 0.5,
    },
  },
  player: {
    acceleration: 35,
    deacceleration: 17,
    maxSpeed: 13,
    maxInteractionDistance: 25,
    minInteractionDistance: 0.05,
  },
  oscinoodles: {
    colors: [
      0xb9d8c2,
      0x9ac2c9,
      0x8aa1b1,
      0x4a5043,
      0xffcb47,
      0xff595e,
    ],
    radius: 0.2,
    maxSwing: 20,
    minSegments: 1,
    maxSegments: 32,
    segmentHeight: 0.2,
    positionalAudio: {
      refDistance: 5,
    },
    mouthSize: 0.05,
    mouthGrow: 2,
    mouthSpeed: 6,
  },
};

export default SETTINGS;
