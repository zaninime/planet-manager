/* globals describe it expect */
import * as ofCollector from './collector';

const status = {
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

const config = {
  daylight: {
    white: {
      intensity: 15,
      delay: 50,
    },
    red: {
      intensity: 15,
      delay: 50,
      duration: 20,
    },
    blue: {
      intensity: 100,
    },
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
    intensity: 38,
  },
  mode: 'master'
};

describe('daylight', () => {
  it('translates correctly color configurations', () => {
    expect(ofCollector.collect(config, status).daylight.intensity).toEqual(1);
    expect(ofCollector.collect(config, status).daylight.mainColor).toEqual(1);

    config.daylight.white.intensity = 30;   //red config
    config.daylight.red.intensity = 40;
    config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(config, status).daylight.intensity).toEqual(0.47);
    expect(ofCollector.collect(config, status).daylight.mainColor).toBeLessThan(-0.5);

    config.daylight.white.intensity = 80;   //red config
    config.daylight.red.intensity = 15;
    config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(config, status).daylight.intensity).toEqual(0.76);
    expect(ofCollector.collect(config, status).daylight.mainColor).toEqual(0);

  });
});

describe('night', () => {
  it('reads night color and intensity correctly', () => {
    expect(ofCollector.collect(config, status).night.color).toEqual('blue');
    expect(ofCollector.collect(config, status).night.intensity).toEqual(0.38);
  });
});

describe('timings', () => {
  it('finds out dawn and dusk timings correctly', () => {
    expect(ofCollector.collect(config, status).timings.dawnBeginsAt).toEqual(50);
    expect(ofCollector.collect(config, status).timings.duskEndsAt).toEqual(130);
  });
});

describe('twilight', () => {
  it('gives an acceptable red level answer', () => {
    const redLevel1 = ofCollector.collect(config, status).twilight.redLevel;
    expect(0 <= redLevel1 && redLevel1 <= 1).toBeTruthy();

    config.daylight.red.delay = 0;
    config.daylight.white.delay = 30;

    const redLevel2 = ofCollector.collect(config, status).twilight.redLevel;
    expect(0 <= redLevel2 && redLevel2 <= 1).toBeTruthy();
  });

  it('corrects bad configs clamping them', () => {
    config.daylight.red.delay = 0;
    config.daylight.white.delay = 31;

    const redLevel1 = ofCollector.collect(config, status).twilight.redLevel;
    expect(0 <= redLevel1 && redLevel1 <= 1).toBeTruthy();

    config.daylight.red.delay = 30;
    config.daylight.white.delay = 29;

    const redLevel2 = ofCollector.collect(config, status).twilight.redLevel;
    expect(0 <= redLevel2 && redLevel2 <= 1).toBeTruthy();
  });

  it('gives the correct red level value', () => {
    config.daylight.red.delay = 0;
    config.daylight.white.delay = 0;

    expect(ofCollector.collect(config, status).twilight.redLevel).toEqual(0);

    config.daylight.red.delay = 0;
    config.daylight.white.delay = 30;

    expect(ofCollector.collect(config, status).twilight.redLevel).toEqual(1);

    config.daylight.red.delay = 40;
    config.daylight.white.delay = 50;

    expect(ofCollector.collect(config, status).twilight.redLevel).toBeCloseTo(0.33,0.01);
  });
});
