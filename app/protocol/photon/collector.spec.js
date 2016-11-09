/* globals describe it expect beforeEach jasmine */
import { collect } from './collector';

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
                intensity: 15,
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
        expect(collect(this.config, this.status).daylight.intensity).toEqual(1);
        expect(collect(this.config, this.status).daylight.mainColor).toEqual(1);

        this.config.daylight.white.intensity = 30;   // red config
        this.config.daylight.red.intensity = 40;
        this.config.daylight.blue.intensity = 15;

        expect(collect(this.config, this.status).daylight.intensity).toEqual(0.47);
        expect(collect(this.config, this.status).daylight.mainColor).toBeLessThan(-0.5);

        this.config.daylight.white.intensity = 80;   // red config
        this.config.daylight.red.intensity = 15;
        this.config.daylight.blue.intensity = 15;

        expect(collect(this.config, this.status).daylight.intensity).toEqual(0.76);
        expect(collect(this.config, this.status).daylight.mainColor).toEqual(0);
    });
});

describe('night', () => {
    beforeEach(genericBeforeEach);

    it('reads night color and intensity correctly', function () {
        expect(collect(this.config, this.status).night.color).toEqual('blue');
        expect(collect(this.config, this.status).night.intensity).toEqual(0.38);
    });
});

describe('timings', () => {
    beforeEach(genericBeforeEach);

    it('finds out dawn and dusk timings correctly', function () {
        expect(collect(this.config, this.status).timings.dawnBeginsAt).toEqual(50);
        expect(collect(this.config, this.status).timings.duskEndsAt).toEqual(130);
    });
});

describe('twilight', () => {
    beforeEach(genericBeforeEach);

    it('gives an acceptable red level answer', function () {
        const redLevel1 = collect(this.config, this.status).twilight.redLevel;
        expect(redLevel1 >= 0 && redLevel1 <= 1).toBeTruthy();

        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 30;

        const redLevel2 = collect(this.config, this.status).twilight.redLevel;
        expect(redLevel2 >= 0 && redLevel2 <= 1).toBeTruthy();
    });

    it('corrects bad configs clamping them', function () {
        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 31;

        const redLevel1 = collect(this.config, this.status).twilight.redLevel;
        expect(redLevel1 >= 0 && redLevel1 <= 1).toBeTruthy();

        this.config.daylight.red.delay = 30;
        this.config.daylight.white.delay = 29;

        const redLevel2 = collect(this.config, this.status).twilight.redLevel;
        expect(redLevel2 >= 0 && redLevel2 <= 1).toBeTruthy();
    });

    it('gives the correct red level value', function () {
        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 0;

        expect(collect(this.config, this.status).twilight.redLevel).toEqual(0);

        this.config.daylight.red.delay = 0;
        this.config.daylight.white.delay = 30;

        expect(collect(this.config, this.status).twilight.redLevel).toEqual(1);

        this.config.daylight.red.delay = 40;
        this.config.daylight.white.delay = 50;

        expect(collect(this.config, this.status).twilight.redLevel).toBeCloseTo(0.33, 0.01);
    });
});

describe('channels', () => {
    beforeEach(genericBeforeEach);

    it('returns 12 channels for a generic lamp model', function () {
        expect(collect(this.config, this.status).channels.length).toBe(12);
    });

    it('returns 6 channels for PlanetCompact', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 201;

        expect(collect(this.config, this.status).channels.length).toBe(6);
    });
});

describe('features', () => {
    beforeEach(genericBeforeEach);

    it('recognizes a PlanetPRO v1', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 114;

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        const computedFeatures = collect(this.config, this.status).features;

        expect(expectedFeatures).toEqual(jasmine.objectContaining(computedFeatures));
        expect(computedFeatures).toEqual(jasmine.objectContaining(expectedFeatures));
    });

    it('recognizes a PlanetPRO v2', function () {
        this.status.productId = 562;
        this.status.firmwareVersion = 300;

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            DEMO_MODE: true,
        };

        const computedFeatures = collect(this.config, this.status).features;

        expect(expectedFeatures).toEqual(jasmine.objectContaining(computedFeatures));
        expect(computedFeatures).toEqual(jasmine.objectContaining(expectedFeatures));
    });

    it('recognizes a PlanetCompact', function () {
        this.status.productId = 16;
        this.status.firmwareVersion = 201;

        const expectedFeatures = {
            CHANNEL_MAPPING: true,
            CHANNEL_MAPPING_COMPACT: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        };

        const computedFeatures = collect(this.config, this.status).features;

        expect(expectedFeatures).toEqual(jasmine.objectContaining(computedFeatures));
        expect(computedFeatures).toEqual(jasmine.objectContaining(expectedFeatures));
    });

    it('recognizes a PlanetStella', function () {
        this.status.productId = 564;
        this.status.firmwareVersion = 300;

        const expectedFeatures = {
            CLOCK_SYNC: true,
            DEMO_MODE: true,
        };

        const computedFeatures = collect(this.config, this.status).features;

        expect(expectedFeatures).toEqual(jasmine.objectContaining(computedFeatures));
        expect(computedFeatures).toEqual(jasmine.objectContaining(expectedFeatures));
    });
});
