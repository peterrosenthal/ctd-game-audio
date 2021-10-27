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
    acceleration: 40,
    deacceleration: 10,
    maxSpeed: 15,
  },
};

export default SETTINGS;
