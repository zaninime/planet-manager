/* globals describe it */
import { expect } from 'chai';
import * as ofClock from './clock';
import { ProtocolError } from '../errors';

describe('parseResponse', () => {
  it('parses a valid response without throwing errors', () => {
    const response = 'PLANETCOUNTER12FAB\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).to.not.throw(Error);
  });

  it('throws a ProtocolError for an invalid format', () => {
    const response = 'PLANETCOUNTER123AG\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).to.throw(ProtocolError);
  });
});

describe('buildUpdate', () => {
  it('creates a valid update request', () => {
    const date = new Date();
    date.setHours(13);
    date.setMinutes(34);
    date.setSeconds(39);
    expect(ofClock.buildUpdate(date)).to.equal('\x02SETCOUNTER0BEEF\x03');
  });

  it('checks for argument validity', () => {
    expect(ofClock.buildUpdate.bind(undefined, 'date')).to.throw(TypeError);
  });
});

describe('buildRequest', () => {
  it('creates a valid request', () => {
    expect(ofClock.buildRequest()).to.equal('\x02GETCOUNTER\x03');
  });
});
