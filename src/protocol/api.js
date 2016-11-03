import { decode } from 'utils/lampId';
import { fetchGeneric, saveGeneric } from './plug';
import * as ofClock from './data/clock';
import * as ofStatus from './data/status';
import * as ofConfig from './data/config';
import * as ofWifi from './data/wifi';

const fetchGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return fetchGeneric(address, port, query);
};

const saveGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return saveGeneric(address, port, query);
};

export const fetchWifiConfig = (lampId) => fetchGenericLampId(lampId, ofWifi.buildRequest()).then(ofWifi.parseResponse);
export const saveWifiConfig = (lampId, config) => saveGenericLampId(lampId, ofWifi.buildUpdate(config));

export const fetchConfig = (lampId) => fetchGenericLampId(lampId, ofConfig.buildRequest()).then(ofConfig.parseResponse);
export const saveConfig = (lampId, config) => saveGenericLampId(lampId, ofConfig.buildUpdate(config));

export const fetchStatus = (lampId) => fetchGenericLampId(lampId, ofStatus.buildRequest()).then(ofStatus.parseResponse);
export const applyTempColor = (lampId, {white, red, green, blue}) => saveGenericLampId(lampId, ofStatus.buildUpdate(white, red, green, blue));

export const fetchClock = (lampId) => fetchGenericLampId(lampId, ofClock.buildRequest()).then(ofClock.parseResponse);
export const saveClock = (lampId, clock) => (saveGenericLampId(lampId, ofClock.buildUpdate(clock)));
