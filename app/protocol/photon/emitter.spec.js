/* globals describe it expect beforeEach */
import { daylight } from './emitter';

describe('daylight', () => {
    beforeEach(function () {
        this.caps = {
            bugs: [],
            features: {
                CHANNEL_MAPPING: true,
                CLOCK_SYNC: true,
                FAN_CONFIG: true,
                TEMPERATURE_CONFIG: true,
                MASTER_SWITCH: true,
                DEMO_MODE: true,
            },
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
            channels: [],
            temperature: {},
            fan: {},
            master: true,
            bugs: ['EARLY_DUSK'],
            features: ['MASTER_SWITCH', 'CHANNEL_MAPPING', 'FAN_CONFIG', 'TEMPERATURE_CONFIG'],
        };
    });

    it('generates correct white channel configurations', function () {
        // color is blue, intensity is 100%
        expect(daylight(this.config, this.caps).white.intensity).toEqual(40);

        // color is red, intensity is 100%
        this.config.daylight.mainColor = -1;
        expect(daylight(this.config, this.caps).white.intensity).toEqual(40);

        // color is white, intensity is 100%
        this.config.daylight.mainColor = 0;
        expect(daylight(this.config, this.caps).white.intensity).toEqual(100);

        // color is orange, intensity is 50%
        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).white.intensity).toBeCloseTo(42, 0);

        // color is cyan, intensity is 50%
        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).white.intensity).toBeCloseTo(42, 0);
    });

    it('generates correct red channel configurations', function () {
        // color is blue, intensity is 100%
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(daylight(this.config, this.caps).red.intensity).toEqual(15);

        this.config.daylight.mainColor = -1;
        expect(daylight(this.config, this.caps).red.intensity).toEqual(100);

        // color is white, intensity is 100%
        this.config.daylight.mainColor = 0;
        expect(daylight(this.config, this.caps).red.intensity).toEqual(100);

        // color is cyan, intensity is 50%
        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).red.intensity).toEqual(15);

        // color is orange, intensity is 100%
        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).red.intensity).toBeCloseTo(57, 0);
    });

    it('generates correct blue channel configurations', function () {
        // color is blue, intensity is 100%
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(daylight(this.config, this.caps).blue.intensity).toEqual(100);

        // color is red, intensity is 100%
        this.config.daylight.mainColor = -1;
        expect(daylight(this.config, this.caps).blue.intensity).toEqual(15);

        // color is white, intensity is 100%
        this.config.daylight.mainColor = 0;
        expect(daylight(this.config, this.caps).blue.intensity).toEqual(100);

        // color is orange, intensity is 50%
        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).blue.intensity).toEqual(15);

        // color is cyan, intensity is 50%
        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(daylight(this.config, this.caps).blue.intensity).toBeCloseTo(57, 0);
    });

    it('generates correct green channel configurations', function () {
        this.config.daylight.mainColor = -1;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(15, 0);

        this.config.daylight.mainColor = -0.499;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight.mainColor = -0.5;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight.mainColor = 0;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(100, 0);

        this.config.daylight.mainColor = 0.499;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight.mainColor = 0.5;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(70, 0);

        this.config.daylight.mainColor = 1;
        expect(daylight(this.config, this.caps).green.intensity).toBeCloseTo(15, 0);
    });

    it('generates correct duration values', function () {
        expect(daylight(this.config, this.caps).green.duration).toEqual(140);

        this.config.timings.dawnBeginsAt = 0;
        this.config.timings.duskEndsAt = 1000;
        expect(daylight(this.config, this.caps).green.duration).toEqual(940);

        this.config.timings.dawnBeginsAt = 1400;
        this.config.timings.duskEndsAt = 1500;
        expect(daylight(this.config, this.caps).green.duration).toEqual(0);

        this.config.timings.dawnBeginsAt = 300;
        this.config.timings.duskEndsAt = 200;
        expect(daylight(this.config, this.caps).green.duration).toEqual(0);
    });

    it('generates correct delay values', function () {
        this.config.timings.dawnBeginsAt = 300;
        this.config.timings.duskEndsAt = 500;
        this.config.twilight.redLevel = 0;
        expect(daylight(this.config, this.caps).red.delay).toEqual(300);
        expect(daylight(this.config, this.caps).green.delay).toEqual(300);
        expect(daylight(this.config, this.caps).blue.delay).toEqual(300);
        expect(daylight(this.config, this.caps).white.delay).toEqual(300);

        this.config.timings.dawnBeginsAt = 0;
        this.config.timings.duskEndsAt = 1000;
        this.config.twilight.redLevel = 0.5;
        expect(daylight(this.config, this.caps).red.delay).toEqual(0);
        expect(daylight(this.config, this.caps).green.delay).toEqual(15);
        expect(daylight(this.config, this.caps).blue.delay).toEqual(15);
        expect(daylight(this.config, this.caps).white.delay).toEqual(15);

        this.config.twilight.redLevel = 0.2;
        expect(daylight(this.config, this.caps).red.delay).toEqual(0);
        expect(daylight(this.config, this.caps).green.delay).toEqual(6);
        expect(daylight(this.config, this.caps).blue.delay).toEqual(6);
        expect(daylight(this.config, this.caps).white.delay).toEqual(6);

        this.config.timings.dawnBeginsAt = 1500;
        this.config.timings.duskEndsAt = 1500;
        this.config.twilight.redLevel = 0;
        expect(daylight(this.config, this.caps).red.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).green.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).blue.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).white.delay).toEqual(1379);

        this.config.timings.duskEndsAt = 0;
        this.config.twilight.redLevel = 0;
        expect(daylight(this.config, this.caps).red.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).green.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).blue.delay).toEqual(1379);
        expect(daylight(this.config, this.caps).white.delay).toEqual(1379);
    });

    it('generates correct slope values', function () {
        this.config.twilight.redLevel = 0;
        expect(daylight(this.config, this.caps).red.slope).toEqual(30);
        expect(daylight(this.config, this.caps).green.slope).toEqual(30);
        expect(daylight(this.config, this.caps).blue.slope).toEqual(30);
        expect(daylight(this.config, this.caps).white.slope).toEqual(30);

        this.config.twilight.redLevel = 0.5;
        expect(daylight(this.config, this.caps).red.slope).toEqual(30);
        expect(daylight(this.config, this.caps).green.slope).toEqual(15);
        expect(daylight(this.config, this.caps).blue.slope).toEqual(15);
        expect(daylight(this.config, this.caps).white.slope).toEqual(15);

        this.config.twilight.redLevel = 0.2;
        expect(daylight(this.config, this.caps).red.slope).toEqual(30);
        expect(daylight(this.config, this.caps).green.slope).toEqual(24);
        expect(daylight(this.config, this.caps).blue.slope).toEqual(24);
        expect(daylight(this.config, this.caps).white.slope).toEqual(24);
    });

    it('returns full red when dayColor = -1', function () {
        this.config.daylight.mainColor = -1;
        this.config.daylight.intensity = 1;
        expect(daylight(this.config, this.caps).white.intensity).toBe(40);
        expect(daylight(this.config, this.caps).red.intensity).toBe(100);
        expect(daylight(this.config, this.caps).green.intensity).toBe(15);
        expect(daylight(this.config, this.caps).blue.intensity).toBe(15);
    });

    it('returns full blue when dayColor = 1', function () {
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(daylight(this.config, this.caps).white.intensity).toBe(40);
        expect(daylight(this.config, this.caps).red.intensity).toBe(15);
        expect(daylight(this.config, this.caps).green.intensity).toBe(15);
        expect(daylight(this.config, this.caps).blue.intensity).toBe(100);
    });

    it('returns full white when dayColor = 0', function () {
        this.config.daylight.mainColor = 0;
        this.config.daylight.intensity = 1;
        expect(daylight(this.config, this.caps).white.intensity).toBe(100);
        expect(daylight(this.config, this.caps).red.intensity).toBe(100);
        expect(daylight(this.config, this.caps).green.intensity).toBe(100);
        expect(daylight(this.config, this.caps).blue.intensity).toBe(100);
    });
});
