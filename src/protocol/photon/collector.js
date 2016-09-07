/* eslint-disable no-unused-vars */
import { blockOnFetch } from './bugs';

const collectTarget = (target) => (config, status) => {
  return Object.keys(target).reduce((nextTarget, key) => {
    nextTarget[key] = target[key](config, status);
    return nextTarget;
  }, {});
};

const daylight = (config, status) => {
  return {
    mainColor: 0.7,
    intensity: 0.4
  };
};

const night = (config) => {
  return {
    color: config.night.color,
    intensity: config.night.intensity/100
  };
};

const timings = (config, status) => {
  return {
    dawnBeginsAt: 123,
    duskEndsAt: 123
  };
};

const twilight = (config, status) => {
  return {
    redLevel: 0.5
  };
};

const channels = (config, status) => {
  let channels = config.channels;
  // if compact, return just 6 channels
  const compactChannels = [2, 3, 6, 7, 10, 11];
  const isCompact = Math.floor(status.firmwareVersion/100) == 2;
  if (isCompact) {
    channels = compactChannels.map((idx) => config.channels[idx]);
  }
  return channels.map((c) => {
    if (c === 'off') return {color: 'white', enabled: false};
    return {color: c, enabled: true};
  });
};

const temperature = (config) => config.temperature;

const fan = (config) => config.fan;

const master = (config) => config.mode === 'master';

const features = (config, status) => {
  return [];
};

export const collect = (config, status) => {
  const convert = collectTarget({daylight, night, timings, twilight, channels, temperature, fan, master, features});
  const {config: bugFreeConfig, bugs} = blockOnFetch(config, status);
  return {...convert(bugFreeConfig, status), bugs};
};
