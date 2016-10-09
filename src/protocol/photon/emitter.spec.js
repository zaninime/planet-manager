/* globals describe it expect */
import * as ofEmitter from './emitter';

describe('daylight', () => {
  const caps = {
    bugs: [],
    features: {
      'CHANNEL_MAPPING': true,
      'CLOCK_SYNC': true,
      'FAN_CONFIG': true,
      'TEMPERATURE_CONFIG': true,
      'MASTER_SWITCH': true,
      'DEMO_MODE': true
    }
  };

  const config = {
    daylight: {
      mainColor: 1,
      intensity: 1
    },
    night: {                // as is
      color: 'blue',
      intensity: 0.1
    },
    timings: {
      dawnBeginsAt: 300,
      duskEndsAt: 500
    },
    twilight: {
      redLevel: 0
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

  it('generates correct white channel configurations', () => {
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).toEqual(15);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).toBeCloseTo(36, 0);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).toBeCloseTo(36, 0);
  });

  it('generates correct red channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).toEqual(15);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).toEqual(15);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).toBeCloseTo(36, 0);
  });
  it('generates correct blue channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).toEqual(100);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).toEqual(15);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).toBeCloseTo(36, 0);
  });
  it('generates correct green channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).toEqual(10);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).toBeCloseTo(24, 0);
    config.daylight.mainColor = -0.49;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).toBeCloseTo(24, 0);
  });
  it('generates correct duration values', () => {
    expect(ofEmitter.emit(config, caps).daylight.green.duration).toEqual(140);
    config.timings.dawnBeginsAt = 0;
    config.timings.duskEndsAt = 1000;
    expect(ofEmitter.emit(config, caps).daylight.green.duration).toEqual(940);
  });

  it('generates correct delay values', () => {
    config.timings.dawnBeginsAt = 300;
    config.timings.duskEndsAt = 500;
    config.twilight.redLevel = 0;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).toEqual(300);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).toEqual(300);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).toEqual(300);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).toEqual(300);
    config.timings.dawnBeginsAt = 0;
    config.timings.duskEndsAt = 1000;
    config.twilight.redLevel = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).toEqual(0);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).toEqual(15);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).toEqual(15);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).toEqual(15);
    config.twilight.redLevel = 0.2;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).toEqual(0);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).toEqual(6);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).toEqual(6);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).toEqual(6);
  });
  it('generates correct slope values', () => {
    config.twilight.redLevel = 0;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).toEqual(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).toEqual(30);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).toEqual(30);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).toEqual(30);
    config.twilight.redLevel = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).toEqual(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).toEqual(15);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).toEqual(15);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).toEqual(15);
    config.twilight.redLevel = 0.2;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).toEqual(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).toEqual(24);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).toEqual(24);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).toEqual(24);
  });
});
