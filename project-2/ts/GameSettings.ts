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
      intensity: 0.8,
      position: {
        x: -4,
        y: 5,
        z: 2,
      },
    },
    ambient: {
      color: 0xffffff,
      intensity: 0.2,
    },
  },
  player: {
    acceleration: 35,
    deacceleration: 17,
    maxSpeed: 13,
  },
  oscinoodles: {
    color: 0x3abaef,
    radius: 0.25,
    minSegments: 1,
    maxSegments: 32,
    segmentHeight: 0.22,
    positionalAudio: {
      refDistance: 20,
    },
  },
};

export default SETTINGS;
