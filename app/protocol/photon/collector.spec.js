/* globals describe it expect beforeEach jasmine */
import { daylight, night, timings, twilight, channels, features } from './collector';

function genericBeforeEach() {
    this.status = {
        productId: 16,
        colors: {
            white: 45,
            red: 98,
            green: 78,
            blue: 42,
        },
        fanSpeed: 45,
        temperature: 28.3,
        linkQuality: 102,
        serial: 0,
        firmwareVersion: 114,
    };

    this.config = {
        daylight: {
            white: {
                intensity: 40,
                delay: 50,
            },
            red: {
                intensity: 15,
                delay: 50,
                duration: 20,
            },
            blue: {
                intensity: 100,
            },
        },
        channels: ['white', 'red', 'green', 'blue', 'white', 'red', 'green', 'blue', 'off', 'off', 'off', 'off'],
        temperature: {
            fanStart: 12,
            shutdown: 50,
        },
        fan: {
            minSpeed: 10,
            speedRamp: 50,
            maxSpeed: 100,
        },
        night: {
            color: 'blue',
            intensity: 38,
        },
        mode: 'master',
    };
}

describe('daylight', () => {
    beforeEach(genericBeforeEach);

    it('translates correctly color configurations', function () {
        expect(daylight(this.config, this.status).intensity).toBe(1);
        expect(daylight(this.config, this.status).mainColor).toBe(1);

        this.config.daylight.white.intensity = 70;   // orange config
        this.config.daylight.red.intensity = 100;
        this.config.daylight.blue.intensity = 15;

        expect(daylight(this.config, this.status).intensity).toBe(1);
        expect(daylight(this.config, this.status).mainColor).toBe(-0.5);

        this.config.daylight.white.intensity = 10;   // total blue low light config with brokem red and white value
        this.config.daylight.red.intensity = 10;
        this.config.daylight.blue.intensity = 32;

        expect(daylight(this.config, this.status).intensity).toBe(0.2);
        expect(daylight(this.config, this.status).mainColor).toBe(1);

        this.config.daylight.white.intensity = 100;   // Broken config, low light, should return white
        this.config.daylight.red.intensity = 0;
        this.config.daylight.blue.intensity = 57.5;

        expect(daylight(this.config, this.status).intensity).toBe(0.5);
        expect(daylight(this.config, this.status).mainColor).toBe(0);
    });
});

describe('night', () => {
    beforeEach(genericBeforeEach);

    it('reads night color and intensity correctly', function () {
        expect(night(this.config, this.status).color).toEqual('blue');
        expect(night(this.config, this.status).intensity).toEqual(0.38);
    });
});

describe('timings', () => {
    beforeEach(genericBeforeEach);

    it('finds out dawn and dusk timings correctly', function () {
        expect(timings(this.config, this.status).dawnBeginsAt).toEqual(50);
        expect(timings(this.config, this.status).duskEndsAt).toEqual(130);
    });
});

describe('twilight', () => {
    beforeEach(genericBeforeEach);

    it('gives an acceptable red level answer', function () {
        const redLevel1 = twilight(this.config, this.status).redLevel;
        expect(redLevel1 >= 0 && redLevel1 <= 1).toBeTruthy();

        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 30;

        const redLevel2 = twilight(this.config, this.status).redLevel;
        expect(redLevel2 >= 0 && redLevel2 <= 1).toBeTruthy();
    });

    it('corrects bad configs clamping them', function () {
        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 31;

        const redLevel1 = twilight(this.config, this.status).redLevel;
        expect(redLevel1 >= 0 && redLevel1 <= 1).toBeTruthy();

        this.config.daylight.red.delay = 30;
        this.config.daylight.white.delay = 29;

        const redLevel2 = twilight(this.config, this.status).redLevel;
        expect(redLevel2 >= 0 && redLevel2 <= 1).toBeTruthy();
    });

    it('gives the correct red level value', function () {
        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 0;

        expect(twilight(this.config, this.status).redLevel).toEqual(0);

        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 30;

        expect(twilight(this.config, this.status).redLevel).toEqual(1);

        this.config.daylight.red.delay = 40;
        this.config.daylight.white.delay = 50;

        expect(twilight(this.config, this.status).redLevel).toBeCloseTo(0.33, 0.01);
    });
});

describe('channels', () => {
    beforeEach(genericBeforeEach);

    it('returns 12 channels for a generic lamp model', function () {
        expect(channels(this.config, this.status).length).toBe(12);
    });

    it('returns 6 channels for PlanetCompact', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 201;

        expect(channels(this.config, this.status).length).toBe(6);
    });
});

describe('features', () => {
    beforeEach(genericBeforeEach);

    it('recognizes a PlanetPRO v1', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 40 + (Math.floor((Math.random() * 20)) * 2); // even version means compact

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        const computedFeatures = features(this.config, this.status);

        expect(expectedFeatures).toEqual(computedFeatures);
        expect(computedFeatures).toEqual(expectedFeatures);
    });

    it('recognizes a PlanetPRO v2', function () {
        this.status.productId = 101;
        this.status.firmwareVersion = Math.floor(Math.random() * 300);

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            DEMO_MODE: true,
        };

        const computedFeatures = features(this.config, this.status);

        expect(expectedFeatures).toEqual(computedFeatures);
        expect(computedFeatures).toEqual(expectedFeatures);
    });

    it('recognizes a PlanetCompact', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 40 + (Math.floor((Math.random() * 20)) * 2) + 1; // odd version means compact

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CHANNEL_MAPPING_COMPACT: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        const computedFeatures = features(this.config, this.status);

        expect(expectedFeatures).toEqual(computedFeatures);
        expect(computedFeatures).toEqual(expectedFeatures);
    });

    it('recognizes a PlanetStella', function () {
        this.status.productId = 100;
        this.status.firmwareVersion = Math.floor(Math.random() * 300);

        const expectedFeatures = {
            CLOCK_SYNC: true,
            DEMO_MODE: true,
        };

        const computedFeatures = features(this.config, this.status);

        expect(expectedFeatures).toEqual(computedFeatures);
        expect(computedFeatures).toEqual(expectedFeatures);
    });
});
