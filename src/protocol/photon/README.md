# Photon

**This is a work in progress!**

The goal of this module is to convert the lamp configuration (called `lampConfig`) to an intelligible representation used by the application (called `highLevel`).

The module should also identify different lamp models and firmware versions, in order to declare and correct specific bugs. Bugs and features should be considered in each function, processed inline.

The file `collector.js` aims to convert the config from the lamp to the app, while `emitter.js` does the inverse.

Please see `SPEC.md` for an overview of the models, features and bugs of the Planet lamps.

```javascript
const highLevel = {
  daylight: {
    mainColor: 0.4,        // from -1 (full red) to 1 (full blue)
    intensity: 0.7         // range 0-1
  },
  night: {                // as is
    color: 'blue',
    intensity: 0.1
  },
  timings: {              // minutes from midnight
    dawnBeginsAt: 12345,
    duskEndsAt: 12345
  },
  twilight: {
    redLevel: 0.4         // range 0-1, 0 is neutral, 1 is full red
  },
  channels: [],           // as is from lamp
  temperature: {
    // as is from lamp
  },
  fan: {
    // as is from lamp
  },
  master: true,
  bugs: ['EARLY_DUSK'],
  features: ['MASTER_SWITCH', 'CHANNEL_MAPPING', 'FAN_CONFIG', 'TEMPERATURE_CONFIG']
};

const lampConfig = {
  daylight: {
    white: {
      intensity: 56,
      delay: 345,
      duration: 600,
      slope: 43
    },
    red: {},
    green: {},
    blue: {},
  },
  channels: [],
  temperature: {
    fanStart: 12,
    shutdown: 50
  },
  fan: {
    minSpeed: 10,
    speedRamp: 50,        // wtf is that
    maxSpeed: 100
  },
  night: {
    color: 'blue',
    intensity: 0.1
  },
  mode: 'master'
};

const lampStatus = {
  productId: 16,          // useful for identifying models and features
  colors: {
    white: 45,
    red: 98,
    green: 78,
    blue: 42,
  },
  fanSpeed: 45,
  temperature: 28.3,
  linkQuality: 102,       // this should be a percentage
  serial: 0,              // may be zero
  firmwareVersion: 114    // useful for identifying bugs and apply corrections
};
```
