/* globals chrome */
import { EventEmitter } from 'events';
import { createIOError } from './errors';
import { ab2str } from './arraybuffer';

export const createDiscoveryListener = () => (new Promise((resolve, reject) => {
  const {udp} = chrome.sockets;
  udp.create({}, ({socketId}) => {
    udp.bind(socketId, '0.0.0.0', 55555, (bindRes) => {
      if (bindRes < 0) reject(createIOError('BIND', bindRes));
      udp.setBroadcast(socketId, true, (broadcastRes) => {
        if (broadcastRes < 0) {
          reject(createIOError('BCAST'));
        }
        resolve((listener) => {
          onReceiveEmitter.on(socketId, listener);
        });
      });
    });
  });
}));

const onReceiveEmitter = new EventEmitter();

export const init = () => {
  chrome.sockets.udp.onReceive.addListener(({socketId, remoteAddress, remotePort, data}) => {
    onReceiveEmitter.emit(socketId, remoteAddress, remotePort, ab2str(data));
  });
};
