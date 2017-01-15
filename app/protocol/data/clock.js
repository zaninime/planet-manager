import leftPad from 'left-pad';
import { ProtocolError } from '../errors';

export const parseResponse = (str) => {
    const regex = /^PLANETCOUNTER([\dA-F]{5})\r\n$/;
    const m = str.match(regex);
    if (m === null) throw new ProtocolError('Invalid clock response', str);
    const seconds = parseInt(m[1], 16);
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setSeconds(seconds);
    return date;
};

export const buildUpdate = (clock) => {
    if (!(clock instanceof Date)) {
        throw new TypeError(`Clock value ${clock} is invalid. It must be a valid date object.`);
    }
    const secondsClock = (clock.getHours() * 3600) + (clock.getMinutes() * 60) + clock.getSeconds();
    const strSecondsClock = leftPad(parseInt(secondsClock, 10).toString(16).toUpperCase(), 5, '0');
    return `\x02SETCOUNTER${strSecondsClock}\x03`;
};

export const buildRequest = () => '\x02GETCOUNTER\x03';
