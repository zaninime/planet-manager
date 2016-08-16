/* globals NativeWifiDiscovery */
import { EventEmitter } from 'events';
import { v4 as uuid4 } from 'node-uuid';

const onReceiveEmitter = new EventEmitter();

export const createDiscoveryListener = () => (new Promise((resolve) => {
  resolve((listener) => {
    onReceiveEmitter.on('beacon', listener);
  });
}));

const nativeCallback = beacon => {
  onReceiveEmitter.emit('beacon', beacon.address, beacon.port, atob(beacon.content));
};

export const init = () => {
  const id = 'cb_discovery_' + uuid4().replace(/-/g, '_');
  window[id] = nativeCallback;
  NativeWifiDiscovery.stop();
  NativeWifiDiscovery.start(id);
};
