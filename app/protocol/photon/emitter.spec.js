/* globals describe it expect beforeEach */
import * as ofEmitter from './emitter';

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
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.intensity).toEqual(15);

        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.intensity).toBeCloseTo(36, 0);

        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.intensity).toBeCloseTo(36, 0);
    });

    it('generates correct red channel configurations', function () {
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.intensity).toEqual(15);

        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.intensity).toEqual(15);

        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.intensity).toBeCloseTo(36, 0);
    });

    it('generates correct blue channel configurations', function () {
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.intensity).toEqual(100);

        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.intensity).toEqual(15);

        this.config.daylight.mainColor = 0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.intensity).toBeCloseTo(36, 0);
    });

    it('generates correct green channel configurations', function () {
        this.config.daylight.mainColor = 1;
        this.config.daylight.intensity = 1;
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.intensity).toEqual(10);

        this.config.daylight.mainColor = -0.5;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.intensity).toBeCloseTo(24, 0);

        this.config.daylight.mainColor = -0.49;
        this.config.daylight.intensity = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.intensity).toBeCloseTo(24, 0);
    });

    it('generates correct duration values', function () {
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.duration).toEqual(140);

        this.config.timings.dawnBeginsAt = 0;
        this.config.timings.duskEndsAt = 1000;
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.duration).toEqual(940);
    });

    it('generates correct delay values', function () {
        this.config.timings.dawnBeginsAt = 300;
        this.config.timings.duskEndsAt = 500;
        this.config.twilight.redLevel = 0;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.delay).toEqual(300);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.delay).toEqual(300);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.delay).toEqual(300);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.delay).toEqual(300);

        this.config.timings.dawnBeginsAt = 0;
        this.config.timings.duskEndsAt = 1000;
        this.config.twilight.redLevel = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.delay).toEqual(0);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.delay).toEqual(15);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.delay).toEqual(15);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.delay).toEqual(15);

        this.config.twilight.redLevel = 0.2;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.delay).toEqual(0);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.delay).toEqual(6);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.delay).toEqual(6);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.delay).toEqual(6);
    });

    it('generates correct slope values', function () {
        this.config.twilight.redLevel = 0;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.slope).toEqual(30);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.slope).toEqual(30);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.slope).toEqual(30);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.slope).toEqual(30);

        this.config.twilight.redLevel = 0.5;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.slope).toEqual(30);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.slope).toEqual(15);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.slope).toEqual(15);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.slope).toEqual(15);

        this.config.twilight.redLevel = 0.2;
        expect(ofEmitter.emit(this.config, this.caps).daylight.red.slope).toEqual(30);
        expect(ofEmitter.emit(this.config, this.caps).daylight.green.slope).toEqual(24);
        expect(ofEmitter.emit(this.config, this.caps).daylight.blue.slope).toEqual(24);
        expect(ofEmitter.emit(this.config, this.caps).daylight.white.slope).toEqual(24);
    });
});
