import { decode } from 'utils/lampId';
import { ab2str } from './arraybuffer';
import nativeRequire from 'require';
import { createIOError, createProtocolError } from './errors';
import * as ofClock from './data/clock';
import * as ofStatus from './data/status';
import * as ofConfig from './data/config';

const net = nativeRequire('net');

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
  const sock = new net.Socket();
  let state = 0;
  sock.on('connect', () => {
    state = 1;
  });
  sock.on('data', (data) => {
    data = ab2str(data);
    switch (state) {  
    case 1:
      if (!/\*HELLO\*/.test(data)) {
        reject(createProtocolError('Invalid handshake received'));
      }
      state = 2;
      sock.write(query, 'ASCII', () => {
        state = 3;
      });
      break;
    case 3:
      state = 4;
      sock.end();
      resolve(data);
      break;
    }
  });
  sock.on('error', (err) => {
    reject(createIOError('NATIVE', err.message));
  });
  sock.on('end', () => {
    switch (state) {
    case 4:
      break;
    default:
      reject(createProtocolError('Connection closed prematurely'));
    }
  });
  sock.on('timeout', () => {
    reject(createIOError('TIMEOUT'));
  });
  sock.setNoDelay(true);
  sock.setTimeout(1000);
  sock.connect(port, address);
}));

const saveGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return saveGeneric(address, port, query);
};

export const saveGeneric = (address, port, query) => (new Promise((resolve, reject) => {
  const sock = new net.Socket();
  let state = 0;
  sock.on('connect', () => {
    state = 1;
  });
  sock.on('data', (data) => {
    switch (state) {  
    case 1:
      if (!/\*HELLO\*/.test(data)) {
        reject(createProtocolError('Invalid handshake received'));
      }
      state = 2;
      sock.write(query, 'ASCII', () => {
        state = 3;
        sock.end();
        resolve();
      });
      break;
    }
  });
  sock.on('error', (err) => {
    reject(createIOError('NATIVE', err.message));
  });
  sock.on('end', () => {
    switch (state) {
    case 3:
      break;
    default:
      reject(createProtocolError('Connection closed prematurely'));
    }
  });
  sock.on('timeout', () => {
    reject(createIOError('TIMEOUT'));
  });
  sock.setNoDelay(true);
  sock.setTimeout(1000);
  sock.connect(port, address);
}));

