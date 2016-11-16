import { ab2str } from './arraybuffer';
import { createIOError, ProtocolError } from './errors';

const net = window.require('net');

export const fetchGeneric = (address, port, query) => (new Promise((resolve, reject) => {
    const sock = new net.Socket();
    let state = 0;
    sock.on('connect', () => {
        state = 1;
    });
    sock.on('data', (data) => {
        const strData = ab2str(data);
        switch (state) {
        case 1:
            if (!/\*HELLO\*/.test(strData)) {
                reject(new ProtocolError('Invalid handshake received'));
            }
            state = 2;
            sock.write(query, 'ASCII', () => {
                state = 3;
            });
            break;
        case 3:
            state = 4;
            sock.end();
            resolve(strData);
            break;
        default:
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
            reject(new ProtocolError('Connection closed prematurely'));
        }
    });
    sock.on('timeout', () => {
        reject(createIOError('TIMEOUT'));
    });
    sock.setNoDelay(true);
    sock.setTimeout(1000);
    sock.connect(port, address);
}));

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
                reject(new ProtocolError('Invalid handshake received'));
            }
            state = 2;
            sock.write(query, 'ASCII', () => {
                state = 3;
                sock.end();
                resolve();
            });
            break;
        default:
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
            reject(new ProtocolError('Connection closed prematurely'));
        }
    });
    sock.on('timeout', () => {
        reject(createIOError('TIMEOUT'));
    });
    sock.setNoDelay(true);
    sock.setTimeout(1000);
    sock.connect(port, address);
}));
