/* eslint-disable no-unused-vars */
import { blockOnFetch } from './bugs';
import { twilightDuration, floorIntensity, compactChannels } from './constants';
import EError from 'utils/error';

class IncompatibleConfigError extends EError {}

const collectTarget = (target) => (config, status) => {
  return Object.keys(target).reduce((nextTarget, key) => {
    nextTarget[key] = target[key](config, status);
    return nextTarget;
  }, {});
};

const daylight = (config) => {
  const r = config.daylight.red.intensity / 100;
  const b = config.daylight.blue.intensity / 100;
  const w = config.daylight.white.intensity / 100;

  const intensity = +(Math.max(((r + w - 2*floorIntensity) / (1 - floorIntensity)), ((b + w - 2*floorIntensity) / (1 - floorIntensity)))).toFixed(2);
  let mainColor;
  if (b > r) {
    mainColor = (b - floorIntensity) / ((1 - floorIntensity) * intensity);
  } else if (r > b) {
    mainColor = -(r - floorIntensity) / ((1 - floorIntensity) * intensity);
  } else if (r == b) {
    mainColor = 0;
  } else {
    throw new IncompatibleConfigError('Invalid daylight configuration');
  }

  return {
    mainColor,
    intensity
  };
};

const night = (config) => {
  return {
    color: config.night.color,
    intensity: config.night.intensity / 100
  };
};

const timings = (config) => {
  return {
    dawnBeginsAt: config.daylight.red.delay,
    duskEndsAt: (config.daylight.red.delay + config.daylight.red.duration + 2 * twilightDuration),
  };
};

const twilight = (config) => {
  return {
    redLevel: Math.min(1, Math.max(0,(config.daylight.white.delay - config.daylight.red.delay) / twilightDuration)),
  };
};

const channels = (config, status) => {
  let channels = config.channels;
  // if compact, return just 6 channels
  const isCompact = Math.floor(status.firmwareVersion / 100) == 2;
  if (isCompact) {
    channels = compactChannels.map((idx) => config.channels[idx]);
  }
  return channels.map((c) => {
    if (c === 'off') return { color: 'white', enabled: false };
    return { color: c, enabled: true };
  });
};

const temperature = (config) => ({...config.temperature});

const fan = (config) => ({...config.fan});

const master = (config) => config.mode === 'master';

const features = (config, status) => {
  const set = {
    'CHANNEL_MAPPING': true,
    'CLOCK_SYNC': true,
    'FAN_CONFIG': true,
    'TEMPERATURE_CONFIG': true,
    'MASTER_SWITCH': true,
    'DEMO_MODE': true
  };
  const isCompact = Math.floor(status.firmwareVersion / 100) == 2;
  if (isCompact) set['CHANNEL_MAPPING_COMPACT'] = true;
  return set;
};

export const collect = (config, status) => {
  const convert = collectTarget({ daylight, night, timings, twilight, channels, temperature, fan, master, features });
  const {config: bugFreeConfig, bugs} = blockOnFetch(config, status);
  return { ...convert(bugFreeConfig, status), bugs };
};
