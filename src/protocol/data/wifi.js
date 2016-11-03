/* @flow */
import { currifiedPad } from './utils';
import { createProtocolError } from '../errors';

export type WifiConfig = {|
  ssid: string,
  password: string,
  channel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto',
  address: string,
  mask: string,
  gateway: string,
  port: number,
  dhcp: boolean,
  mode: 'station' | 'ibss',
|};

const reformatIPAddress = (str) => str.split('.').map((e) => parseInt(e)).join('.');

const validateIPAdress = (str) => {
  const parts = str.split('.');
  if (parts.length !== 4) {
    return false;
  }
  return parts.every((e) => {
    const byte = parseInt(e);
    if (isNaN(byte)) return false;
    return (0 <= byte && byte < 256);
  });
};

const validateTCPPort = (str) => {
  const port = parseInt(str);
  if (isNaN(port)) return false;
  return (0 < port && port < 65536);
};

const zeroedStringPad = len => str => {
  if (str.length >= len) {
    return str;
  }
  const padLength = len - str.length;
  return str + (new Array(padLength)).fill('\x00').join('');
};

const fixedLengthIPAddress = addr => {
  const pad = currifiedPad(3);
  return addr.split('.').map(e => parseInt(e)).map(pad).join('');
};

export const parseResponse = (str): WifiConfig => {
  const parts = str.slice(0, -2).split(',');
  if (parts.length !== 9) throw createProtocolError('Invalid number of fields');

  const ipFields = [2, 6, 7];
  if (!ipFields.map(e => parts[e]).every(validateIPAdress)) throw createProtocolError('Invalid IP address');
  if (!validateTCPPort(parts[3])) throw createProtocolError('Invalid TCP port number');

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
    throw createProtocolError('Invalid DHCP mode');
  }

  let channel = parseInt(parts[5]);
  if (!(0 <= channel && channel <= 12)) throw createProtocolError('Invalid Wi-Fi channel');
  if (channel === 0) channel = 'auto';

  let mode;
  switch (parts[8]) {
  case '0':
    mode = 'station';
    break;
  case '1':
    mode = 'ibss';
    break;
  default:
    throw createProtocolError('Invalid Wi-Fi mode');
  }
  return {
    ssid: parts[0],
    password: parts[1],
    address: reformatIPAddress(parts[2]),
    port: parseInt(parts[3]),
    dhcp,
    channel,
    gateway: reformatIPAddress(parts[6]),
    mask: reformatIPAddress(parts[7]),
    mode,
  };
};

export const buildUpdate = (config: WifiConfig) => {
  const strPad32 = zeroedStringPad(32);
  const pad4 = currifiedPad(4);
  const parts = [
    '\x02WiFishSETLAN',
    fixedLengthIPAddress(config.address),
    strPad32(config.ssid),
    strPad32(config.password),
    pad4(config.port),
    fixedLengthIPAddress(config.gateway),
    '192168000123',
    fixedLengthIPAddress(config.mask),
    '2'
  ];
  if (config.mode === 'ibss') {
    parts.push('4', '1');
  } else {
    parts.push(config.dhcp ? '1' : '0', '0');
  }
  parts.push(currifiedPad(2)(config.channel), '\x03');
  return parts.join('');
};

export const buildRequest = () => '\x02WiFishGETLAN\x03';
