/* globals chrome */
import { decode } from 'utils/lampId';
import { EventEmitter } from 'events';
import { str2ab, ab2str } from './arraybuffer';
import { createIOError, createProtocolError } from './errors';
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

const sendCatch = (socketId, sendInfo, reject) => {
  if (sendInfo < 0) {
    onReceiveEmitter.removeAllListeners(socketId);
    chrome.sockets.tcp.close(socketId);
    reject(createIOError('SEND', sendInfo));
  }
};

const fetchGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return fetchGeneric(address, port, query);
};

const fetchGeneric = (address, port, query) => (new Promise((resolve, reject) => {
  const receiver = (query, resolve, reject) => (socketId) => {
    let state = 0;
    return (data) => {
      switch (state) {
        case 0:
          if (/\*HELLO\*/.test(data)) {
            chrome.sockets.tcp.send(socketId, str2ab(query), (sendInfo) => {
              state = 1;
              sendCatch(socketId, sendInfo, reject);
            });
          } else {
            reject(createProtocolError('Invalid handshake received'));
          }
          break;
        case 1:
          state = 2;
          onReceiveEmitter.removeAllListeners(socketId);
          chrome.sockets.tcp.close(socketId, () => resolve(data));
          break;
      }
    };
  };
  initSocket(address, port, receiver(query, resolve, reject))
    .catch((err) => {reject(err);});    // TODO: implement errors
}));

const saveGenericLampId = (lampId, query) => {
  const {address, port} = decode(lampId);
  return saveGeneric(address, port, query);
};

const saveGeneric = (address, port, query) => (new Promise((resolve, reject) => {
  const receiver = (query, resolve, reject) => (socketId) => {
    let state = 0;
    return (data) => {
      switch (state) {
        case 0:
          if (/\*HELLO\*/.test(data)) {
            chrome.sockets.tcp.send(socketId, str2ab(query), (sendInfo) => {
              state = 1;
              sendCatch(socketId, sendInfo, reject);
              onReceiveEmitter.removeAllListeners(socketId);
              chrome.sockets.tcp.close(socketId, () => resolve());
            });
          } else {
            reject(createProtocolError('Invalid handshake received'));
          }
          break;
      }
    };
  };
  initSocket(address, port, receiver(query, resolve, reject))
    .catch((err) => {reject(err);});    // TODO: implement errors
}));

const initSocket = (address, port, receiverCreator) => (new Promise((resolve, reject) => {
  let socketId;
  let receiver;
  const onConnectedCallback = (res) => {
    if (res < 0) {
      reject(createIOError('CONNECT', res));
    } else {
      chrome.sockets.tcp.setNoDelay(socketId, true, function() {});
      resolve({socketId, receiver});
    }
  };
  chrome.sockets.tcp.create({}, (createInfo) => {
    socketId = createInfo.socketId;
    receiver = receiverCreator(socketId);
    onReceiveEmitter.on(socketId, receiver);
    chrome.sockets.tcp.connect(createInfo.socketId, address, port, onConnectedCallback);
  });
}));

/*const closeSocket = (socketId, receiver) => (new Promise((resolve) => {
  onReceiveEmitter.removeListener(socketId, receiver);
  chrome.sockets.tcp.close(socketId, resolve);
}));*/

const onReceiveEmitter = new EventEmitter();

export const init = () => {
  chrome.sockets.tcp.onReceive.addListener((info) => {
    const {socketId, data} = info;
    onReceiveEmitter.emit(socketId, ab2str(data));
  });
};
