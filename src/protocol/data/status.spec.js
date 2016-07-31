/* globals describe it */
import * as ofStatus from './status';
import { expect } from 'chai';
import { ProtocolError } from '../errors';

describe('status:parseResponse', () => {
  it('parses a valid response', () => {
    const response = '01600000000001500023710000000114\r\n';
    expect(ofStatus.parseResponse(response)).to.contain.all.keys(['productId', 'colors']);
  });

  it('throw an error for an invalid response', () => {
    const response = '0160000000000150002371000000011\r\n';
    expect(ofStatus.parseResponse.bind(undefined, response)).to.throw(ProtocolError);
  });
});

describe('status:buildUpdate', () => {
  it('creates a valid update', () => {
    expect(ofStatus.buildUpdate(100, 99, 10, 1)).to.equal('\x02PLANETSETSTATUS01100099010001\x03');
  });

  it('checks input parameters type validity', () => {
    expect(ofStatus.buildUpdate.bind(undefined)).to.throw(TypeError);
  });

  it('checks input parameters validity range', () => {
    expect(ofStatus.buildUpdate.bind(undefined, 101)).to.throw(RangeError);
  });
});

describe('status:buildRequest', () => {
  it('creates a valid request', () => {
    expect(ofStatus.buildRequest()).to.equal('\x02PLANETGETSTATUS01\x03');
  });
});
