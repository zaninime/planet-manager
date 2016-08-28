import { createIOError } from './errors';
import nativeRequire from 'require';

const dgram = nativeRequire('dgram');

export const createDiscoveryListener = () => (new Promise((resolve, reject) => {
  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    reject(createIOError('NATIVE', err));
    server.close();
  });

  server.bind(55555);

  resolve(listener => {
    server.on('message', listener);
  });
}));
