/* globals describe it expect beforeEach */
import * as ofWifi from './wifi';
import { ProtocolError } from '../errors';

describe('parseResponse', () => {
    beforeEach(function () {
        this.response = [
            'My SSID',
            'str0ng-password',
            '111.255.123.000',
            '01234',
            '1',
            '07',
            '001.002.003.004',
            '255.255.255.248',
            '0\r\n',
        ].join(',');
    });

    it('parses a valid response without throwing errors', function () {
        expect(ofWifi.parseResponse.bind(undefined, this.response)).not.toThrowError();
    });

    it('maps fields correctly', function () {
        const parsed = ofWifi.parseResponse(this.response);
        expect(parsed.ssid).toEqual('My SSID');
        expect(parsed.password).toEqual('str0ng-password');
        expect(parsed.address).toEqual('111.255.123.0');
        expect(parsed.port).toBe(1234);
        expect(parsed.dhcp).toBe(true);
        expect(parsed.channel).toBe(7);
        expect(parsed.gateway).toEqual('1.2.3.4');
        expect(parsed.mask).toEqual('255.255.255.248');
        expect(parsed.mode).toEqual('station');
    });

    it('throws an error for missing fields', function () {
        const parts = this.response.split(',');
        parts.shift();
        expect(ofWifi.parseResponse.bind(undefined, parts.join(','))).toThrow(ProtocolError);
    });
});

describe('buildUpdate', () => {
    beforeEach(function () {
        this.config = {
            ssid: 'My SSID',
            password: 'str0ng-password',
            address: '172.16.0.100',
            mask: '255.255.255.0',
            gateway: '172.16.0.254',
            port: 5000,
            dhcp: true,
            channel: 4,
            mode: 'ibss',
        };

        this.encoded = ofWifi.buildUpdate(this.config);
    });

    it('pads string fields', function () {
        const { encoded } = this;
        const prefix = '\x02WiFishSETLAN123456789012';
        const ssidPad = encoded.slice(prefix.length + this.config.ssid.length, prefix.length + 32);
        const passwordPad = encoded.slice(prefix.length + 32 + this.config.password.length, prefix.length + 64);
        expect(ssidPad.split('').every(e => e === '\x00')).toBe(true);
        expect(passwordPad.split('').every(e => e === '\x00')).toBe(true);
    });

    it('encodes IP addresses with the right format', function () {
        const { encoded } = this;
        expect(encoded).toMatch(/\x02WiFishSETLAN\d{12}.{64}\d{4}\d{12}\d{12}\d{12}2\d{4}\x03/);
    });

    it('outputs consistent DHCP/Wi-Fi mode', function () {
        const re = /\x02WiFishSETLAN\d{12}.{64}\d{4}\d{12}\d{12}\d{12}2(\d)(\d)\d{2}\x03/;
        let encoded = ofWifi.buildUpdate(this.config);
        let match = encoded.match(re);
        expect(match[1]).toEqual('4');
        expect(match[2]).toEqual('1');

        this.config.mode = 'managed';
        encoded = ofWifi.buildUpdate(this.config);
        match = encoded.match(re);
        expect(match[1]).toEqual('1');
        expect(match[2]).toEqual('0');
    });
});

describe('buildRequest', () => {
    it('creates a valid request', () => {
        expect(ofWifi.buildRequest()).toEqual('\x02WiFishGETLAN\x03');
    });
});
