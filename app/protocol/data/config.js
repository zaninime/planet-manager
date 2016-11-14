import { ProtocolError } from '../errors';
import { currifiedPad } from './utils';

const int = x => parseInt(x, 10);
const toInt = x => Math.round(x);
const pad2 = currifiedPad(2);
const pad3 = currifiedPad(3);

const parseDayColor = (color, timingStr, intensityStr) => {
    const regex = /^(\d{2})(\d{2})(\d{2})(\d{2})\d{8}(\d{2})/;
    const m = timingStr.match(regex);
    if (m === null) throw new ProtocolError(`Invalid color configuration format for channel ${color}`, timingStr);
    return {
        delay: (int(m[1]) * 60) + int(m[2]),
        duration: (int(m[3]) * 60) + int(m[4]),
        slope: int(m[5]),
        intensity: int(intensityStr),
    };
};

const parseChannels = str => str.split('').map((e) => {
    switch (e) {
    case '0':
        return 'off';
    case '1':
        return 'white';
    case '2':
        return 'red';
    case '3':
        return 'green';
    case '4':
        return 'blue';
    default:
        throw new ProtocolError('Invalid channel mapping configuration', e);
    }
});

const parseTemperature = (str) => {
    const regex = /^(\d{3})\d{9}(\d{3})$/;
    const m = str.match(regex);
    if (m === null) throw new ProtocolError('Invalid temperature configuration format', str);
    return {
        fanStart: int(m[1]),
        shutdown: int(m[2]),
    };
};

const parseFan = (str) => {
    const regex = /^\d{3}(\d{3})(\d{3})(\d{3})\d{3}$/;
    const m = str.match(regex);
    if (m === null) throw new ProtocolError('Invalid fan configuration format', str);
    return {
        minSpeed: int(m[1]),
        speedRamp: int(m[2]),
        maxSpeed: int(m[3]),
    };
};

const parseNight = (str) => {
    const regex = /^(\d)(\d{3})$/;
    const m = str.match(regex);
    if (m === null) throw new ProtocolError('Invalid night configuration format', str);
    let color;
    switch (m[1]) {
    case '0':
    case '4':
        color = 'blue';
        break;
    case '1':
        color = 'white';
        break;
    case '2':
        color = 'red';
        break;
    case '3':
        color = 'green';
        break;
    default:
        throw new ProtocolError('Invalid night color', m[1]);
    }
    return {
        color,
        intensity: int(m[2]),
    };
};

const parseMode = (str) => {
    switch (str) {
    case '0':
        return 'slave';
    case '1':
        return 'master';
    default:
        throw new ProtocolError('Invalid mode configuration format', str);
    }
};

export const parseResponse = (str) => {
    const topRegex = /^(\d{18})(\d{18})(\d{18})(\d{18})(\d{12})(\d{15})(\d{4})(\d{3})(\d{3})(\d{3})(\d{3})(\d)\r\n$/;
    const m = str.match(topRegex);
    if (m === null) throw new ProtocolError('Invalid configuration format', str);
    const out = {
        daylight: {
            white: parseDayColor('white', m[1], m[8]),
            red: parseDayColor('red', m[2], m[9]),
            green: parseDayColor('green', m[3], m[10]),
            blue: parseDayColor('blue', m[4], m[11]),
        },
        channels: parseChannels(m[5]),
        temperature: parseTemperature(m[6]),
        fan: parseFan(m[6]),
        night: parseNight(m[7]),
        mode: parseMode(m[12]),
    };

    return out;
};

export const buildUpdate = (config) => {
    const parts = [];
    for (const color of [config.daylight.white, config.daylight.red, config.daylight.green, config.daylight.blue]) { // eslint-disable-line
        const delay = [Math.floor(color.delay / 60), color.delay % 60];
        const duration = [Math.floor(color.duration / 60), color.duration % 60];
        parts.push(
            `${pad2(toInt(delay[0])) +
                pad2(toInt(delay[1])) +
                pad2(toInt(duration[0])) +
                pad2(toInt(duration[1]))}00000000${pad2(toInt(color.slope))}`);
    }
    const channelMap = { white: 1, red: 2, green: 3, blue: 4, off: 0 };
    parts.push(config.channels.map(e => channelMap[e]).join(''));
    parts.push(
        pad3(toInt(config.temperature.fanStart)) +
        pad3(toInt(config.fan.minSpeed)) +
        pad3(toInt(config.fan.speedRamp)) +
        pad3(toInt(config.fan.maxSpeed)) +
        pad3(toInt(config.temperature.shutdown)));
    const nightModeMap = { white: '1', red: '2', green: '3', blue: '4' };
    parts.push(nightModeMap[config.night.color] + pad3(toInt(config.night.intensity)));
    parts.push(
        pad3(toInt(config.daylight.white.intensity)) +
        pad3(toInt(config.daylight.red.intensity)) +
        pad3(toInt(config.daylight.green.intensity)) +
        pad3(toInt(config.daylight.blue.intensity)));
    const modeMap = { master: '1', slave: '0' };
    parts.push(modeMap[config.mode]);
    return `\x02PLANETSETPARAM01${parts.join('')}\x03`;
};

export const validate = () => {
    throw new Error('Not implemented');
};

export const buildRequest = () => '\x02PLANETGETPARAM01\x03';
