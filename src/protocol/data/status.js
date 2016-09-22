import { currifiedPad } from './utils';
import { createProtocolError } from '../errors';

const pad3 = currifiedPad(3);
const int = parseInt;

export const parseResponse = (str) => {
  const regex = /^(016)(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{4})(\d{4})\r\n$/;
  const m = str.match(regex);
  if (m === null) throw createProtocolError('Invalid status response format');
  return {
    productId: int(m[1]),
    colors: {
      white: int(m[2]),
      red: int(m[3]),
      green: int(m[4]),
      blue: int(m[5])
    },
    fanSpeed: int(m[6]),
    temperature: int(m[7])/10,
    linkQuality: int(m[8]),
    serial: int(m[9]),
    firmwareVersion: int(m[10])
  };
};

export const buildUpdate = (w, r, g, b) => {
  for (const c of [w, r, g, b]) {
    if (isNaN(c)) throw TypeError(`Expected a number, got a ${typeof c}`);
    if (!(0 <= c && c <= 100)) throw RangeError(`Channel intensity value out of range: ${c}`);
  }
  return `\x02PLANETSETSTATUS01${pad3(int(w))}${pad3(int(r))}${pad3(int(g))}${pad3(int(b))}\x03`;
};

export const buildRequest = () => '\x02PLANETGETSTATUS01\x03';
