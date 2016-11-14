/* globals NativeWifiSocket */
import { v4 as uuid4 } from 'node-uuid';
import { createIOError, ProtocolError } from './errors';

const CB_PREFIX = 'cb_socket_';

const getGlobalCallbackFunc = uuid => (CB_PREFIX + uuid.replace(/-/g, '_'));

const createGlobalCallbackAuto = (cb) => {
    const uuid = uuid4();
    const id = getGlobalCallbackFunc(uuid);
    window[id] = (...args) => {
        cb(...args);
        delete window[id];
    };
    return id;
};

export const fetchGeneric = (address, port, query) => (new Promise((resolve, reject) => {
    const res = JSON.parse(NativeWifiSocket.fetchGeneric(address, port, query, createGlobalCallbackAuto((info) => {
        if (info.result === 'ok') {
            return resolve(info.responseText);
        }
        const err = info.error;
        switch (err.name) {
        case 'eu.elos.planetmgr.app.wifi.socket.InvalidHandshakeException':
            return reject(new ProtocolError('Invalid handshake received'));
        case 'java.net.SocketTimeoutException':
            return reject(createIOError('TIMEOUT'));
        default:
            return reject(createIOError('NATIVE', err.message));
        }
    })));
    if (res.result !== 'ok') {
        reject(createIOError('NATIVE', 'Couldn\'t initiate the requested operation'));
    }
}));

export const saveGeneric = (address, port, query) => (new Promise((resolve, reject) => {
    const res = JSON.parse(NativeWifiSocket.saveGeneric(address, port, query, createGlobalCallbackAuto((info) => {
        if (info.result === 'ok') {
            return resolve();
        }
        const err = info.error;
        switch (err.name) {
        case 'eu.elos.planetmgr.app.wifi.socket.InvalidHandshakeException':
            return reject(new ProtocolError('Invalid handshake received'));
        case 'java.net.SocketTimeoutException':
            return reject(createIOError('TIMEOUT'));
        default:
            return reject(createIOError('NATIVE', err.message));
        }
    })));
    if (res.result !== 'ok') {
        reject(createIOError('NATIVE', 'Couldn\'t initiate the requested operation'));
    }
}));
