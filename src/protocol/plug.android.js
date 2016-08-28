/* globals NativeWifiSocket */
import { decode } from 'utils/lampId';
import { createIOError, createProtocolError } from './errors';
import { v4 as uuid4 } from 'node-uuid';
import * as ofClock from './data/clock';
import * as ofStatus from './data/status';
import * as ofConfig from './data/config';

export const fetchWifiConfig = (lampId) => fetchGenericLampId(lampId, '\x02WiFishGETLAN\x03'); // TODO
export const saveWifiConfig = 1;      // TODO

export const fetchConfig = (lampId) => fetchGenericLampId(lampId, ofConfig.buildRequest()).then(ofConfig.parseResponse);
export const saveConfig = (lampId, config) => saveGenericLampId(lampId, ofConfig.buildUpdate(config));

export const fetchStatus = (lampId) => fetchGenericLampId(lampId, ofStatus.buildRequest()).then(ofStatus.parseResponse);
export const applyTempColor = (lampId, {white, red, green, blue}) => saveGenericLampId(lampId, ofStatus.buildUpdate(white, red, green, blue));

export const fetchClock = (lampId) => fetchGenericLampId(lampId, ofClock.buildRequest()).then(ofClock.parseResponse);
export const saveClock = (lampId, clock) => (saveGenericLampId(lampId, ofClock.buildUpdate(clock)));

const fetchGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return fetchGeneric(address, port, query);
};

export const fetchGeneric = (address, port, query) => (new Promise((resolve, reject) => {
  const res = JSON.parse(NativeWifiSocket.fetchGeneric(address, port, query, createGlobalCallbackAuto(info => {
    if (info.result === "ok") {
      return resolve(info.responseText);
    }
    const err = info.error;
    switch (err.name) {
    case 'eu.elos.planetmgr.app.wifi.socket.InvalidHandshakeException':
      return reject(createProtocolError('Invalid handshake received'));
    default:
      return reject(createIOError('NATIVE', err.message));
    }
  })));
  if (res.result !== 'ok') {
    reject(createIOError('NATIVE', 'Couldn\'t initiate the requested operation'));
  }
}));

const saveGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return saveGeneric(address, port, query);
};

export const saveGeneric = (address, port, query) => (new Promise((resolve, reject) => {
  const res = JSON.parse(NativeWifiSocket.saveGeneric(address, port, query, createGlobalCallbackAuto(info => {
    if (info.result === "ok") {
      return resolve();
    }
    const err = info.error;
    switch (err.name) {
    case 'eu.elos.planetmgr.app.wifi.socket.InvalidHandshakeException':
      return reject(createProtocolError('Invalid handshake received'));
    default:
      return reject(createIOError('NATIVE', err.message));
    }
  })));
  if (res.result !== 'ok') {
    reject(createIOError('NATIVE', 'Couldn\'t initiate the requested operation'));
  }
}));

const CB_PREFIX = 'cb_socket_';
/*const createGlobalCallback = (cb) => {
  const uuid = uuid4();
  const id = getGlobalCallbackFunc(uuid);
  window[id] = cb(uuid);
  return uuid;
};

const revokeGlobalCallback = (uuid) => {
  const id = getGlobalCallbackFunc(uuid);
  delete window[id];
};*/

const getGlobalCallbackFunc = uuid => (CB_PREFIX + uuid.replace(/-/g, '_'));

const createGlobalCallbackAuto = cb => {
  const uuid = uuid4();
  const id = getGlobalCallbackFunc(uuid);
  window[id] = (...args) => {
    cb(...args);
    delete window[id];
  };
  return id;
};
