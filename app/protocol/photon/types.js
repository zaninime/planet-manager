/* @flow */

type LowLevelColor = {|
    intensity: number,
    delay: number,
    duration: number,
    slope: number,
|};

type ChannelColor = 'white' | 'red' | 'green' | 'blue' | 'off';

export type LowLevelConfig = {|
    daylight: {
        white: LowLevelColor,
        red: LowLevelColor,
        green: LowLevelColor,
        blue: LowLevelColor,
    };
    channels: ChannelColor[],
    temperature: {
        fanStart: number,
        shutdown: number,
    },
    fan: {
        minSpeed: number,
        speedRamp: number,
        maxSpeed: number,
    },
    night: {
        color: ChannelColor,
        intensity: number,
    },
    mode: 'master' | 'slave',
|};

export type LampStatus = {|
    productId: number,
    colors: {
        white: number,
        red: number,
        green: number,
        blue: number,
    },
    fanSpeed: number,
    temperature: number,
    linkQuality: number,
    serial: number,
    firmwareVersion: number
|};

export type Features = {|
    CHANNEL_MAPPING?: boolean,
    CHANNEL_MAPPING_COMPACT?: boolean,
    CLOCK_SYNC?: boolean,
    FAN_CONFIG?: boolean,
    TEMPERATURE_CONFIG?: boolean,
    MASTER_SWITCH?: boolean,
    DEMO_MODE?: boolean,
|};

export type HighLevelConfig = {|
    daylight: {
        mainColor: number,
        intensity: number,
    },
    night: {
        color: ChannelColor,
        intensity: number,
    },
    timings: {
        dawnBeginsAt: number,
        duskEndsAt: number,
    },
    twilight: {
        redLevel: number,
    },
    channels: { color: 'white' | 'red' | 'green' | 'blue', enabled: boolean }[],
    temperature: {
        fanStart: number,
        shutdown: number,
    },
    fan: {
        minSpeed: number,
        speedRamp: number,
        maxSpeed: number,
    },
    master: boolean,
    // bugs: ['EARLY_DUSK'],
    bugs: string[],
    features: Features,
|};
