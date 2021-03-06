/* globals describe it expect beforeEach */
import emit, {
    daylight,
    night,
    channels,
    mode,
    fan,
    temperature,
} from './emitter';
import { BUG_EARLY_DUSK } from './bugs';

function genericBeforeEach() {
    this.bugs = [];
    this.features = {
        CHANNEL_MAPPING: true,
        CLOCK_SYNC: true,
        FAN_CONFIG: true,
        TEMPERATURE_CONFIG: true,
        MASTER_SWITCH: true,
        DEMO_MODE: true,
    };

    this.config = {
        daylight: { },
        night: { },
        timings: { },
        twilight: { },
        channels: [],
        temperature: { },
        fan: { },
        master: undefined,
    };
}

beforeEach(genericBeforeEach);

describe('daylight', () => {
    it('generates correct white channel configurations', function () {
        // color is blue, intensity is 100%
        this.config.daylight = { mainColor: 1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toEqual(40);

        // color is red, intensity is 100%
        this.config.daylight = { mainColor: -1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toEqual(40);

        // color is white, intensity is 100%
        this.config.daylight = { mainColor: 0, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toEqual(100);

        // color is orange, intensity is 50%
        this.config.daylight = { mainColor: -0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toBeCloseTo(42, 0);

        // color is cyan, intensity is 50%
        this.config.daylight = { mainColor: 0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toBeCloseTo(42, 0);
    });

    it('generates correct red channel configurations', function () {
        // color is blue, intensity is 100%
        this.config.daylight = { mainColor: 1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toEqual(15);

        this.config.daylight = { mainColor: -1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toEqual(100);

        // color is white, intensity is 100%
        this.config.daylight = { mainColor: 0, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toEqual(100);

        // color is cyan, intensity is 50%
        this.config.daylight = { mainColor: 0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toEqual(15);

        // color is orange, intensity is 100%
        this.config.daylight = { mainColor: -0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toBeCloseTo(57, 0);
    });

    it('generates correct blue channel configurations', function () {
        // color is blue, intensity is 100%
        this.config.daylight = { mainColor: 1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toEqual(100);

        // color is red, intensity is 100%
        this.config.daylight = { mainColor: -1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toEqual(15);

        // color is white, intensity is 100%
        this.config.daylight = { mainColor: -0, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toEqual(100);

        // color is orange, intensity is 50%
        this.config.daylight = { mainColor: -0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toEqual(15);

        // color is cyan, intensity is 50%
        this.config.daylight = { mainColor: 0.5, intensity: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toBeCloseTo(57, 0);
    });

    it('generates correct green channel configurations', function () {
        this.config.daylight = { mainColor: -1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(15, 0);

        this.config.daylight = { mainColor: -0.499, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight = { mainColor: -0.5, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight = { mainColor: 0, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(100, 0);

        this.config.daylight = { mainColor: 0.499, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight = { mainColor: 0.5, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight = { mainColor: 1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBeCloseTo(15, 0);
    });

    describe('duration', function () {
        it('calculates correct duration values in standard configurations', function () {
            this.config.timings = { dawnBeginsAt: 300, duskEndsAt: 500 };
            expect(daylight(this.config, this.features, this.bugs).red.duration).toEqual(140);
            expect(daylight(this.config, this.features, this.bugs).green.duration).toEqual(140);
            expect(daylight(this.config, this.features, this.bugs).blue.duration).toEqual(140);
            expect(daylight(this.config, this.features, this.bugs).white.duration).toEqual(140);
        });
        it('Accecepts dawn at t = 0', function () {
            this.config.timings = { dawnBeginsAt: 0, duskEndsAt: 1000 };
            expect(daylight(this.config, this.features, this.bugs).red.duration).toEqual(940);
            expect(daylight(this.config, this.features, this.bugs).green.duration).toEqual(940);
            expect(daylight(this.config, this.features, this.bugs).blue.duration).toEqual(940);
            expect(daylight(this.config, this.features, this.bugs).white.duration).toEqual(940);
        });
    });

    describe('timings', function () {
        it('throws an error if timings are not compatible', function () {
            this.config.timings = { dawnBeginsAt: 1000, duskEndsAt: 1010 };
            this.config.twilight = { redLevel: 0 };

            expect(daylight.bind(undefined, this.config, this.features, this.bugs)).toThrow();
        });
        it('throws an error if timings are reversed', function () {
            this.config.timings = { dawnBeginsAt: 1500, duskEndsAt: 0 };
            this.config.twilight = { redLevel: 0 };

            expect(daylight.bind(undefined, this.config, this.features, this.bugs)).toThrow();
        });
        it('throws an error if timings are out of range', function () {
            this.config.timings = { dawnBeginsAt: 1500, duskEndsAt: 0 };
            this.config.twilight = { redLevel: 0 };

            expect(daylight.bind(undefined, this.config, this.features, this.bugs)).toThrow();
        });
    });

    describe('delay', function () {
        it('computes correctly a standard configuration', function () {
            this.config.timings = { dawnBeginsAt: 300, duskEndsAt: 500 };
            this.config.twilight = { redLevel: 0 };

            expect(daylight(this.config, this.features, this.bugs).red.delay).toEqual(300);
            expect(daylight(this.config, this.features, this.bugs).green.delay).toEqual(300);
            expect(daylight(this.config, this.features, this.bugs).blue.delay).toEqual(300);
            expect(daylight(this.config, this.features, this.bugs).white.delay).toEqual(300);
        });
        it('computes correctly a standard  configuration with red twilight', function () {
            this.config.timings = { dawnBeginsAt: 0, duskEndsAt: 1000 };
            this.config.twilight = { redLevel: 0.5 };
            expect(daylight(this.config, this.features, this.bugs).red.delay).toEqual(0);
            expect(daylight(this.config, this.features, this.bugs).green.delay).toEqual(10);
            expect(daylight(this.config, this.features, this.bugs).blue.delay).toEqual(10);
            expect(daylight(this.config, this.features, this.bugs).white.delay).toEqual(10);
        });
        it('computes correctly a standard configuration with subtle red twilight', function () {
            this.config.timings = { dawnBeginsAt: 0, duskEndsAt: 1000 };
            this.config.twilight = { redLevel: 0.2 };
            expect(daylight(this.config, this.features, this.bugs).red.delay).toEqual(0);
            expect(daylight(this.config, this.features, this.bugs).green.delay).toEqual(4);
            expect(daylight(this.config, this.features, this.bugs).blue.delay).toEqual(4);
            expect(daylight(this.config, this.features, this.bugs).white.delay).toEqual(4);
        });
    });

    it('generates correct slope values', function () {
        this.config.twilight = { redLevel: 0 };
        expect(daylight(this.config, this.features, this.bugs).red.slope).toEqual(30);
        expect(daylight(this.config, this.features, this.bugs).green.slope).toEqual(30);
        expect(daylight(this.config, this.features, this.bugs).blue.slope).toEqual(30);
        expect(daylight(this.config, this.features, this.bugs).white.slope).toEqual(30);

        this.config.twilight = { redLevel: 0.5 };
        expect(daylight(this.config, this.features, this.bugs).red.slope).toEqual(30);
        expect(daylight(this.config, this.features, this.bugs).green.slope).toEqual(20);
        expect(daylight(this.config, this.features, this.bugs).blue.slope).toEqual(20);
        expect(daylight(this.config, this.features, this.bugs).white.slope).toEqual(20);

        this.config.twilight = { redLevel: 0.2 };
        expect(daylight(this.config, this.features, this.bugs).red.slope).toEqual(30);
        expect(daylight(this.config, this.features, this.bugs).green.slope).toEqual(26);
        expect(daylight(this.config, this.features, this.bugs).blue.slope).toEqual(26);
        expect(daylight(this.config, this.features, this.bugs).white.slope).toEqual(26);
    });

    it('returns full red when dayColor = -1', function () {
        this.config.daylight = { mainColor: -1, intensity: 1 };

        expect(daylight(this.config, this.features, this.bugs).white.intensity).toBe(40);
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toBe(100);
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBe(15);
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toBe(15);
    });

    it('returns full blue when dayColor = 1', function () {
        this.config.daylight = { mainColor: 1, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toBe(40);
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toBe(15);
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBe(15);
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toBe(100);
    });

    it('returns full white when dayColor = 0', function () {
        this.config.daylight = { mainColor: 0, intensity: 1 };
        expect(daylight(this.config, this.features, this.bugs).white.intensity).toBe(100);
        expect(daylight(this.config, this.features, this.bugs).red.intensity).toBe(100);
        expect(daylight(this.config, this.features, this.bugs).green.intensity).toBe(100);
        expect(daylight(this.config, this.features, this.bugs).blue.intensity).toBe(100);
    });
});

describe('channels', function () {
    it('returns an array of valid strings', function () {
        const isValid = v => ['off', 'white', 'red', 'green', 'blue'].indexOf(v) > -1;

        this.config.channels = [
            { enabled: false, color: 'white' },
            { enabled: true, color: 'red' },
            { enabled: true, color: 'green' },
            { enabled: true, color: 'blue' },
            { enabled: true, color: 'white' },
        ];

        expect(channels(this.config, this.features, this.bugs).every(isValid)).toBe(true);
    });

    describe('returns an array of exactly 12 items', function () {
        it('while using a PRO lamp', function () {
            this.features = { CHANNEL_MAPPING: true };
            this.config.channels = [
                { enabled: true, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: true, color: 'red' },
                { enabled: false, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
            ];

            expect(channels(this.config, this.features, this.bugs).length).toBe(12);
        });

        it('while using a Compact lamp', function () {
            this.features = { CHANNEL_MAPPING_COMPACT: true };
            this.config.channels = [
                { enabled: true, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: true, color: 'red' },
            ];

            expect(channels(this.config, this.features, this.bugs).length).toBe(12);
        });

        it('while using a lamp that doesn\'t support channel mapping', function () {
            this.features = { CHANNEL_MAPPING: false };
            this.config.channels = [
                { enabled: true, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: true, color: 'red' },
                { enabled: false, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
            ];

            expect(channels(this.config, this.features, this.bugs).length).toBe(12);
        });
    });

    it('returns all channels \'off\' for a lamp that doesn\'t support channel mapping', function () {
        const isValid = v => v === 'off';

        this.features = { CHANNEL_MAPPING: false };
        this.config.channels = [
            { enabled: true, color: 'white' },
            { enabled: false, color: 'red' },
            { enabled: true, color: 'green' },
        ];

        expect(channels(this.config, this.features, this.bugs).every(isValid)).toBe(true);
    });

    it('throws an error for an invalid color', function () {
        this.config.channels = [{ enabled: true, color: 'purple' }];

        expect(channels.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error if an object in the array is missing some fields', function () {
        this.config.channels = [{ enabled: true }];
        expect(channels.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.channels = [{ color: 'white' }];
        expect(channels.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('returns the expected values', function () {
        const expectedResult = [
            'white', 'off', 'green', 'off', 'off', 'red',
            'off', 'off', 'off', 'off', 'green', 'off',
        ];

        this.config.channels = [
            { enabled: true, color: 'white' },
            { enabled: false, color: 'red' },
            { enabled: true, color: 'green' },
            { enabled: false, color: 'blue' },
            { enabled: false, color: 'white' },
            { enabled: true, color: 'red' },
            { enabled: false, color: 'green' },
            { enabled: false, color: 'blue' },
            { enabled: false, color: 'white' },
            { enabled: false, color: 'red' },
            { enabled: true, color: 'green' },
            { enabled: false, color: 'blue' },
        ];

        expect(channels(this.config, this.features, this.bugs)).toEqual(expectedResult);
    });
});

describe('night', function () {
    it('returns an object containing the right keys', function () {
        const expectedKeys = [
            'color',
            'intensity',
        ];

        this.config.night = { color: 'blue', intensity: 0.1 };

        expect(Object.keys(night(this.config, this.features, this.bugs)).sort()).toEqual(expectedKeys);
    });

    it('throws an error if the input is missing some fields', function () {
        this.config.night = { color: 'blue' };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.night = { intensity: 1 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('rounds to the nearest integer', function () {
        this.config.night = { color: 'blue', intensity: 0.159 };
        expect(night(this.config, this.features, this.bugs).intensity).toBe(16);
    });

    it('maps the value in the correct numerical space', function () {
        this.config.night = { color: 'blue', intensity: 0.1 };
        expect(night(this.config, this.features, this.bugs).intensity).toBe(10);
    });

    it('throws an error for out of range values', function () {
        this.config.night = { color: 'blue', intensity: -1 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.night = { color: 'blue', intensity: 2 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error for an invalid color', function () {
        this.config.night = { color: 'black', intensity: 1 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error for out of range intensity values', function () {
        this.config.night = { color: 'white', intensity: -0.05 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.night = { color: 'white', intensity: 1.3 };
        expect(night.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('rounds to the nearest integer', function () {
        this.config.night = { color: 'white', intensity: 0.013 };
        expect(night(this.config, this.features, this.bugs).intensity).toBe(1);
    });
});

describe('mode', function () {
    it('maps a boolean value to the corresponding string', function () {
        this.config.master = true;
        expect(mode(this.config, this.features, this.bugs)).toBe('master');

        this.config.master = false;
        expect(mode(this.config, this.features, this.bugs)).toBe('slave');
    });
});

describe('fan', function () {
    it('returns an object containing the right keys', function () {
        const expectedKeys = [
            'maxSpeed',
            'minSpeed',
            'speedRamp',
        ];

        this.config.fan = { minSpeed: 0, maxSpeed: 1, speedRamp: 10 };
        expect(Object.keys(fan(this.config, this.features, this.bugs)).sort()).toEqual(expectedKeys);
    });

    it('throws an error if the input is missing some fields', function () {
        this.config.fan = { maxSpeed: 1 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.fan = { minSpeed: 1 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.fan = { speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('rounds to the nearest integer', function () {
        this.config.fan = { minSpeed: 0, maxSpeed: 0.996, speedRamp: 10 };
        expect(fan(this.config, this.features, this.bugs).maxSpeed).toBe(100);

        this.config.fan = { minSpeed: 0.654, maxSpeed: 1, speedRamp: 10 };
        expect(fan(this.config, this.features, this.bugs).minSpeed).toBe(65);
    });

    it('maps fields to the right numerical space', function () {
        this.config.fan = { minSpeed: 0.3, maxSpeed: 0.5, speedRamp: 10 };
        expect(fan(this.config, this.features, this.bugs).maxSpeed).toBe(50);

        this.config.fan = { minSpeed: 0.3, maxSpeed: 0.5, speedRamp: 10 };
        expect(fan(this.config, this.features, this.bugs).minSpeed).toBe(30);
    });

    it('throws an error for out of range maxSpeed values', function () {
        this.config.fan = { minSpeed: 0, maxSpeed: -1, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.fan = { minSpeed: 0, maxSpeed: 1.1, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error for out of range minSpeed values', function () {
        this.config.fan = { minSpeed: -1, maxSpeed: 1, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.fan = { minSpeed: 1.01, maxSpeed: 1, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error if maxSpeed is less than minSpeed', function () {
        this.config.fan = { minSpeed: 0.8, maxSpeed: 0.9, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).not.toThrow();

        this.config.fan = { minSpeed: 0.5, maxSpeed: 0.5, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).not.toThrow();

        this.config.fan = { minSpeed: 0.9, maxSpeed: 0.8, speedRamp: 10 };
        expect(fan.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('doesn\'t modify the speedRamp param', function () {
        this.config.fan = { minSpeed: 0.5, maxSpeed: 0.5, speedRamp: 30 };
        expect(fan(this.config, this.features, this.bugs).speedRamp).toBe(30);
    });

    it('provides an all-zeros default for lamps without a fan', function () {
        this.features = { FAN_CONFIG: false };
        this.config.fan = { minSpeed: 0.5, maxSpeed: 0.5, speedRamp: 10 };

        expect(fan(this.config, this.features, this.bugs)).toEqual({
            minSpeed: 0,
            maxSpeed: 0,
            speedRamp: 0,
        });
    });
});

describe('temperature', function () {
    it('returns an object containing the right keys', function () {
        const expectedKeys = [
            'fanStart',
            'shutdown',
        ];

        this.config.temperature = { fanStart: 0, shutdown: 0 };
        expect(Object.keys(temperature(this.config, this.features, this.bugs)).sort()).toEqual(expectedKeys);
    });

    it('throws an error if the input is missing some fields', function () {
        this.config.temperature = { fanStart: 1 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.temperature = { shutdown: 1 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error for out of range fanStart values', function () {
        this.config.temperature = { fanStart: 1000, shutdown: 0 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.temperature = { fanStart: -2, shutdown: 0 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('throws an error for out of range shutdown values', function () {
        this.config.temperature = { fanStart: 0, shutdown: 1000 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();

        this.config.temperature = { fanStart: 0, shutdown: -1 };
        expect(temperature.bind(undefined, this.config, this.features, this.bugs)).toThrow();
    });

    it('maps fields to the right numerical space', function () {
        this.config.temperature = { fanStart: 40, shutdown: 40 };
        expect(temperature(this.config, this.features, this.bugs).fanStart).toBe(40);

        this.config.temperature = { fanStart: 40, shutdown: 50 };
        expect(temperature(this.config, this.features, this.bugs).shutdown).toBe(50);
    });

    it('provides an all-zeros default for lamps without a fan', function () {
        this.features = { TEMPERATURE_CONFIG: false };
        this.config.temperature = { fanStart: 0.2, shutdown: 0.3 };

        expect(temperature(this.config, this.features, this.bugs)).toEqual({
            fanStart: 0,
            shutdown: 0,
        });
    });
});

describe('emit', function () {
    it('calls all the conversion functions to form an object', function () {
        const functions = [
            'channels',
            'daylight',
            'fan',
            'mode',
            'night',
            'temperature',
        ];

        this.bugs = [];

        this.features = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        this.config = {
            daylight: {
                mainColor: 1,
                intensity: 1,
            },
            night: {
                color: 'blue',
                intensity: 0.1,
            },
            timings: {
                dawnBeginsAt: 300,
                duskEndsAt: 500,
            },
            twilight: {
                redLevel: 0,
            },
            channels: [
                { enabled: true, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: true, color: 'red' },
                { enabled: false, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
            ],
            temperature: {
                fanStart: 0.4,
                shutdown: 0.4,
            },
            fan: {
                minSpeed: 0.5,
                maxSpeed: 0.5,
                speedRamp: 30,
            },
            master: true,
        };

        expect(Object.keys(emit(this.config, this.features, this.bugs)).sort()).toEqual(functions);
    });
});

describe('bugs middleware', function () {
    beforeEach(genericBeforeEach);

    it('solves the early dusk problem', function () {
        this.bugs = [BUG_EARLY_DUSK];

        this.features = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        this.config = {
            daylight: {
                mainColor: 1,
                intensity: 1,
            },
            night: {
                color: 'blue',
                intensity: 0.1,
            },
            timings: {
                dawnBeginsAt: 300,
                duskEndsAt: 500,
            },
            twilight: {
                redLevel: 0,
            },
            channels: [
                { enabled: true, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: true, color: 'red' },
                { enabled: false, color: 'green' },
                { enabled: false, color: 'blue' },
                { enabled: false, color: 'white' },
                { enabled: false, color: 'red' },
                { enabled: true, color: 'green' },
                { enabled: false, color: 'blue' },
            ],
            temperature: {
                fanStart: 0.4,
                shutdown: 0.4,
            },
            fan: {
                minSpeed: 0.5,
                maxSpeed: 0.5,
                speedRamp: 30,
            },
            master: true,
        };

        const result = emit(this.config, this.features, this.bugs);

        expect(result.daylight.white.duration).toBe(170);   // 500 - 300 - 2 * 30 + 30
        expect(result.daylight.red.duration).toBe(170);
        expect(result.daylight.green.duration).toBe(170);
        expect(result.daylight.blue.duration).toBe(170);
    });
});
