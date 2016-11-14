import { currifiedPad } from './utils';
import { ProtocolError } from '../errors';

const pad3 = currifiedPad(3);
const int = x => parseInt(x, 10);
const toInt = x => Math.round(x);

export const parseResponse = (str) => {
    const regex = /^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{4})(\d{4})\r\n$/;
    const m = str.match(regex);
    if (m === null) throw new ProtocolError('Invalid status response format', str);
    return {
        productId: int(m[1]),
        colors: {
            white: int(m[2]),
            red: int(m[3]),
            green: int(m[4]),
            blue: int(m[5]),
        },
        fanSpeed: int(m[6]),
        temperature: int(m[7]) / 10,
        linkQuality: int(m[8]),
        serial: int(m[9]),
        firmwareVersion: int(m[10]),
    };
};

export const buildUpdate = (w, r, g, b) => {
    for (const c of [w, r, g, b]) { // eslint-disable-line
        if (isNaN(c)) throw TypeError(`Expected a number, got a ${typeof c}`);
        if (!(c >= 0 && c <= 100)) throw RangeError(`Channel intensity value out of range: ${c}`);
    }
    return `\x02PLANETSETSTATUS01${pad3(toInt(w))}${pad3(toInt(r))}${pad3(toInt(g))}${pad3(toInt(b))}\x03`;
};

export const buildRequest = () => '\x02PLANETGETSTATUS01\x03';
