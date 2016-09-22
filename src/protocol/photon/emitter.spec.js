/* globals describe it */
import { expect } from 'chai';
import * as ofEmitter from './emitter';

describe('emitter:daylight', () => {
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
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).to.equal(15);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).to.be.closeTo(36,.5);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.white.intensity).to.be.closeTo(36,.5);
  });

  it('generates correct red channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).to.equal(15);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).to.equal(15);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.intensity).to.be.closeTo(36,.5);
  });
  it('generates correct blue channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).to.equal(100);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).to.equal(15);
    config.daylight.mainColor = 0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.blue.intensity).to.be.closeTo(36,.5);
  });
  it('generates correct green channel configurations', () => {
    config.daylight.mainColor = 1;
    config.daylight.intensity = 1;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).to.equal(10);
    config.daylight.mainColor = -0.5;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).to.be.closeTo(24,.5);
    config.daylight.mainColor = -0.49;
    config.daylight.intensity = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.green.intensity).to.be.closeTo(24,.5);
  });
  it('generates correct duration values', () => {
    expect(ofEmitter.emit(config, caps).daylight.green.duration).to.equal(140);
    config.timings.dawnBeginsAt = 0;
    config.timings.duskEndsAt = 1000;
    expect(ofEmitter.emit(config, caps).daylight.green.duration).to.equal(940);
  });

  it('generates correct delay values', () => {
    config.timings.dawnBeginsAt = 300;
    config.timings.duskEndsAt = 500;
    config.twilight.redLevel = 0;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).to.equal(300);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).to.equal(300);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).to.equal(300);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).to.equal(300);
    config.timings.dawnBeginsAt = 0;
    config.timings.duskEndsAt = 1000;
    config.twilight.redLevel = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).to.equal(0);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).to.equal(15);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).to.equal(15);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).to.equal(15);
    config.twilight.redLevel = 0.2;
    expect(ofEmitter.emit(config, caps).daylight.red.delay).to.equal(0);
    expect(ofEmitter.emit(config, caps).daylight.green.delay).to.equal(6);
    expect(ofEmitter.emit(config, caps).daylight.blue.delay).to.equal(6);
    expect(ofEmitter.emit(config, caps).daylight.white.delay).to.equal(6);
  });
  it('generates correct slope values', () => {
    config.twilight.redLevel = 0;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).to.equal(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).to.equal(30);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).to.equal(30);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).to.equal(30);
    config.twilight.redLevel = 0.5;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).to.equal(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).to.equal(15);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).to.equal(15);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).to.equal(15);
    config.twilight.redLevel = 0.2;
    expect(ofEmitter.emit(config, caps).daylight.red.slope).to.equal(30);
    expect(ofEmitter.emit(config, caps).daylight.green.slope).to.equal(24);
    expect(ofEmitter.emit(config, caps).daylight.blue.slope).to.equal(24);
    expect(ofEmitter.emit(config, caps).daylight.white.slope).to.equal(24);
  });
});
