/* globals describe it expect */
import * as ofStatus from './status';
import { ProtocolError } from '../errors';

describe('parseResponse', () => {
    it('parses a valid response', () => {
        const response = '01600000000001500023710000000114\r\n';
        const parsedResponse = ofStatus.parseResponse(response);
        expect(parsedResponse.productId).not.toBeUndefined();
        expect(parsedResponse.colors).not.toBeUndefined();
    });

    it('throw an error for an invalid response', () => {
        const response = '0160000000000150002371000000011\r\n';
        expect(ofStatus.parseResponse.bind(undefined, response)).toThrow(ProtocolError);
    });
});

describe('buildUpdate', () => {
    it('creates a valid update', () => {
        expect(ofStatus.buildUpdate(100, 99, 10, 1)).toEqual('\x02PLANETSETSTATUS01100099010001\x03');
    });

    it('checks input parameters type validity', () => {
        expect(ofStatus.buildUpdate.bind(undefined)).toThrow(TypeError);
    });

    it('checks input parameters validity range', () => {
        expect(ofStatus.buildUpdate.bind(undefined, 101)).toThrow(RangeError);
    });
});

describe('buildRequest', () => {
    it('creates a valid request', () => {
        expect(ofStatus.buildRequest()).toEqual('\x02PLANETGETSTATUS01\x03');
    });
});
