/* globals describe it expect beforeEach */
import * as ofCollector from './collector';

function genericBeforeEach() {
  this.status = {
    productId: 16,
    colors: {
      white: 45,
      red: 98,
      green: 78,
      blue: 42,
    },
    fanSpeed: 45,
    temperature: 28.3,
    linkQuality: 102,
    serial: 0,
    firmwareVersion: 114
  };

  this.config = {
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
      speedRamp: 50,
      maxSpeed: 100
    },
    night: {
      color: 'blue',
      intensity: 38,
    },
    mode: 'master'
  };
}

describe('daylight', function() {
  beforeEach(genericBeforeEach);

  it('translates correctly color configurations', function() {
    expect(ofCollector.collect(this.config, this.status).daylight.intensity).toEqual(1);
    expect(ofCollector.collect(this.config, this.status).daylight.mainColor).toEqual(1);

    this.config.daylight.white.intensity = 30;   //red config
    this.config.daylight.red.intensity = 40;
    this.config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(this.config, this.status).daylight.intensity).toEqual(0.47);
    expect(ofCollector.collect(this.config, this.status).daylight.mainColor).toBeLessThan(-0.5);

    this.config.daylight.white.intensity = 80;   //red config
    this.config.daylight.red.intensity = 15;
    this.config.daylight.blue.intensity = 15;

    expect(ofCollector.collect(this.config, this.status).daylight.intensity).toEqual(0.76);
    expect(ofCollector.collect(this.config, this.status).daylight.mainColor).toEqual(0);

  });
});

describe('night', function() {
  beforeEach(genericBeforeEach);

  it('reads night color and intensity correctly', function() {
    expect(ofCollector.collect(this.config, this.status).night.color).toEqual('blue');
    expect(ofCollector.collect(this.config, this.status).night.intensity).toEqual(0.38);
  });
});

describe('timings', function() {
  beforeEach(genericBeforeEach);
  
  it('finds out dawn and dusk timings correctly', function() {
    expect(ofCollector.collect(this.config, this.status).timings.dawnBeginsAt).toEqual(50);
    expect(ofCollector.collect(this.config, this.status).timings.duskEndsAt).toEqual(130);
  });
});

describe('twilight', function() {
  beforeEach(genericBeforeEach);

  it('gives an acceptable red level answer', function() {
    const redLevel1 = ofCollector.collect(this.config, this.status).twilight.redLevel;
    expect(0 <= redLevel1 && redLevel1 <= 1).toBeTruthy();

    this.config.daylight.red.delay = 0;
    this.config.daylight.white.delay = 30;

    const redLevel2 = ofCollector.collect(this.config, this.status).twilight.redLevel;
    expect(0 <= redLevel2 && redLevel2 <= 1).toBeTruthy();
  });

  it('corrects bad configs clamping them', function() {
    this.config.daylight.red.delay = 0;
    this.config.daylight.white.delay = 31;

    const redLevel1 = ofCollector.collect(this.config, this.status).twilight.redLevel;
    expect(0 <= redLevel1 && redLevel1 <= 1).toBeTruthy();

    this.config.daylight.red.delay = 30;
    this.config.daylight.white.delay = 29;

    const redLevel2 = ofCollector.collect(this.config, this.status).twilight.redLevel;
    expect(0 <= redLevel2 && redLevel2 <= 1).toBeTruthy();
  });

  it('gives the correct red level value', function() {
    this.config.daylight.red.delay = 0;
    this.config.daylight.white.delay = 0;

    expect(ofCollector.collect(this.config, this.status).twilight.redLevel).toEqual(0);

    this.config.daylight.red.delay = 0;
    this.config.daylight.white.delay = 30;

    expect(ofCollector.collect(this.config, this.status).twilight.redLevel).toEqual(1);

    this.config.daylight.red.delay = 40;
    this.config.daylight.white.delay = 50;

    expect(ofCollector.collect(this.config, this.status).twilight.redLevel).toBeCloseTo(0.33,0.01);
  });
});
