/* globals NativeWifiSocket */
import { createIOError, createProtocolError } from './errors';
import { v4 as uuid4 } from 'node-uuid';

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
