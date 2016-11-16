import { createIOError } from './errors';

const dgram = window.require('dgram');

export const createDiscoveryListener = () => (new Promise((resolve, reject) => {    // eslint-disable-line
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        reject(createIOError('NATIVE', err));
        server.close();
    });

    server.bind(55555);

    resolve((listener) => {
        server.on('message', listener);
    });
}));
