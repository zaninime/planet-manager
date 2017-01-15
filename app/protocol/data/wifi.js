/* @flow */
import currifiedPad from './currifiedPad';
import { ProtocolError } from '../errors';

export type WifiConfig = {|
  ssid: string,
  password: string,
  channel: number | 'auto',
  address: string,
  mask: string,
  gateway: string,
  port: number,
  dhcp: boolean,
  mode: 'station' | 'ibss',
|};

const reformatIPAddress = str => str.split('.').map(e => parseInt(e, 10)).join('.');

const validateIPAdress = (str) => {
    const parts = str.split('.');
    if (parts.length !== 4) {
        return false;
    }
    return parts.every((e) => {
        const byte = parseInt(e, 10);
        if (isNaN(byte)) return false;
        return (byte >= 0 && byte < 256);
    });
};

const validateTCPPort = (str) => {
    const port = parseInt(str, 10);
    if (isNaN(port)) return false;
    return (port > 0 && port < 65536);
};

const zeroedStringPad = len => (str) => {
    if (str.length >= len) {
        return str;
    }
    const padLength = len - str.length;
    return str + (new Array(padLength)).fill('\x00').join('');
};

const fixedLengthIPAddress = (addr) => {
    const pad = currifiedPad(3);
    return addr.split('.').map(e => parseInt(e, 10)).map(pad).join('');
};

export const parseResponse = (str: string): WifiConfig => {
    const parts = str.slice(0, -2).split(',');
    if (parts.length !== 9) throw new ProtocolError('Invalid number of fields', str);

    const ipFields = [2, 6, 7];
    if (!ipFields.map(e => parts[e]).every(validateIPAdress)) {
        throw new ProtocolError('Invalid IP address', ipFields.map(e => parts[e]));
    }
    if (!validateTCPPort(parts[3])) throw new ProtocolError('Invalid TCP port number', parts[3]);

    let dhcp;
    switch (parts[4]) {
    case '0':
        dhcp = false;
        break;
    case '1':
    case '4':
        dhcp = true;
        break;
    default:
        throw new ProtocolError('Invalid DHCP mode', parts[4]);
    }

    let channel = parseInt(parts[5], 10);
    if (!(channel >= 0 && channel <= 12)) throw new ProtocolError('Invalid Wi-Fi channel', channel);
    if (channel === 0) channel = 'auto';

    let mode;
    switch (parts[8]) {
    case '0':
        mode = 'ibss';
        break;
    case '1':
        mode = 'station';
        break;
    default:
        throw new ProtocolError('Invalid Wi-Fi mode', parts[8]);
    }
    return {
        ssid: parts[0].replace(/\$/g, ' '),
        password: parts[1],
        address: reformatIPAddress(parts[2]),
        port: parseInt(parts[3], 10),
        dhcp,
        channel,
        gateway: reformatIPAddress(parts[6]),
        mask: reformatIPAddress(parts[7]),
        mode,
    };
};

export const buildUpdate = (config: WifiConfig) => {
    const strPad32 = zeroedStringPad(32);
    const pad5 = currifiedPad(5);
    const parts = [
        '\x02WiFishSETLAN',
        fixedLengthIPAddress(config.address),
        strPad32(config.ssid),
        strPad32(config.password),
        pad5(config.port),
        '5500',
        fixedLengthIPAddress(config.gateway),
        '192168000123',
        fixedLengthIPAddress(config.mask),
        '2',
    ];
    if (config.mode === 'ibss') {
        parts.push('4', '00', '0');
    } else {
        parts.push(config.dhcp ? '1' : '0', '00', '1');
    }
    const channel = config.channel;
    if (typeof channel === 'number') {
        parts.push(currifiedPad(2)(channel));
    } else {
        // if it's a string, it's auto
        parts.push('00');
    }
    return parts.concat('\x03').join('');
};

export const buildRequest = () => '\x02WiFishGETLAN\x03';
