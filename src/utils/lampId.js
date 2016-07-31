import EError from './error.js';

const alphabet = 'ghijklmnopqrstuvwxyz';
const modulo = (a, b) => { return (+a % (b = +b) + b) % b; };

export class AddressFormatError extends EError {
  constructor(type, ...args) {
    switch (type) {
      case 0:
        super(`Invalid IPv4 address: ${args[0]}`);
        break;
      case 1:
        super(`Invalid TCP port number: ${args[0]}`);
        break;
      default:
        super('No cause given');
    }
  }
}

export class LampIdFormatError extends EError {
  constructor(id) {
    super(`Invalid lamp ID: ${id}`);
  }
}

export const encode = (address, port) => {
  const match = address.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (match === null) throw new AddressFormatError(0);
  const valid = match.slice(1).reduce((pre, cur) => {
    const valid = (0 <= cur) && (cur < 256);
    return pre & valid;
  }, true);
  if (!valid) throw new AddressFormatError(0, address);
  if (typeof port !== 'number') throw new AddressFormatError(1, port);
  const intPort = parseInt(port);
  if (isNaN(intPort)) throw new AddressFormatError(1, port);
  if (!((0 < intPort) && (intPort < 65536))) throw new AddressFormatError(1, port);

  let out = match.slice(1).reduce((pre, cur) => {
    let hex = parseInt(cur).toString(16);
    if (hex.length === 1) hex = '0' + hex;
    return pre + hex;
  }, '');

  port = [((intPort >> 8) & 0xff).toString(16), (intPort & 0xff).toString(16)];
  out += port.map((cur) => {
    if (cur.length === 1) return '0' + cur;
    return cur;
  }).join('');

  out = Array.prototype.map.call(out, (cur, idx) => {
    const n = parseInt(cur);
    if (isNaN(n)) return cur;
    return alphabet[(n+idx)%alphabet.length];
  });
  return out.join('');
};

export const decode = (id) => {
  if (typeof id !== 'string') throw new LampIdFormatError(id);
  if (id.length !== 12) throw new LampIdFormatError(id);
  id = Array.prototype.map.call(id, (cur, idx) => {
    const aIdx = alphabet.indexOf(cur);
    if (aIdx == -1) return cur;
    return '' + modulo(aIdx - idx, alphabet.length);
  });
  const parts = [];
  for (let i = 0; i < id.length; i += 2) {
    parts.push(parseInt(id[i] + id[i+1], 16));
  }

  const address = parts.slice(0, 4).join('.');
  const port = (parts[4] << 8 | parts[5]);

  return {address, port};
};
