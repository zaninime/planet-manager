import { ab2str } from './arraybuffer';
import nativeRequire from 'require';
import { createIOError, createProtocolError } from './errors';

const net = nativeRequire('net');

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

