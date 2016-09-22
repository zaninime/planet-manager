/* globals describe it */
import { expect } from 'chai';
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

describe('collector:daylight', () => {
  it('translates correctly color configurations', () => {
/*
    const configRed = {
      ...config,
      daylight:{
        ...config.daylight,
        white: {...config.daylight.white},
        red: {...config.daylight.red},
        green: {...config.daylight.green},
        blue: {...config.daylight.blue},
      },
    };
*/
    expect(ofCollector.collect(config, status).daylight.intensity).to.equal(1);
    expect(ofCollector.collect(config, status).daylight.mainColor).to.equal(1);

    config.daylight.white.intensity = 30;   //red config
    config.daylight.red.intensity = 40;
    config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(config, status).daylight.intensity).to.equal(0.47);
    expect(ofCollector.collect(config, status).daylight.mainColor).to.be.below(-0.5);

    config.daylight.white.intensity = 80;   //red config
    config.daylight.red.intensity = 15;
    config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(config, status).daylight.intensity).to.equal(0.76);
    expect(ofCollector.collect(config, status).daylight.mainColor).to.equal(0);

  });
});

describe('collector:night', () => {
  it('reads night color and intensity correctly', () => {
    expect(ofCollector.collect(config, status).night.color).to.equal('blue');
    expect(ofCollector.collect(config, status).night.intensity).to.equal(0.38);
  });
});

describe('collector:timings', () => {
  it('finds out dawn and dusk timings correctly', () => {
    expect(ofCollector.collect(config, status).timings.dawnBeginsAt).to.equal(50);
    expect(ofCollector.collect(config, status).timings.duskEndsAt).to.equal(130);
  });
});

describe('collector:twilight', () => {
  it('gives an acceptable red level answer', () => {
    expect(ofCollector.collect(config, status).twilight.redLevel).to.be.within(0,1);

    config.daylight.red.delay = 0;
    config.daylight.white.delay = 30;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.be.within(0,1);
  });

  it('corrects bad configs clamping them', () => {
    config.daylight.red.delay = 0;
    config.daylight.white.delay = 31;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.be.within(0,1);

    config.daylight.red.delay = 30;
    config.daylight.white.delay = 29;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.be.within(0,1);
  });

  it('gives the correct red level value', () => {
    config.daylight.red.delay = 0;
    config.daylight.white.delay = 0;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.equal(0);

    config.daylight.red.delay = 0;
    config.daylight.white.delay = 30;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.equal(1);

    config.daylight.red.delay = 40;
    config.daylight.white.delay = 50;

    expect(ofCollector.collect(config, status).twilight.redLevel).to.be.closeTo(0.33,0.01);
  });
});
