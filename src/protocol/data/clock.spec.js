/* globals describe it expect */
import * as ofClock from './clock';
import { ProtocolError } from '../errors';

describe('parseResponse', () => {
  it('parses a valid response without throwing errors', () => {
    const response = 'PLANETCOUNTER12FAB\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).not.toThrow();
  });

  it('throws a ProtocolError for an invalid format', () => {
    const response = 'PLANETCOUNTER123AG\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).toThrowError(ProtocolError);
  });
});

describe('buildUpdate', () => {
  it('creates a valid update request', () => {
    const date = new Date();
    date.setHours(13);
    date.setMinutes(34);
    date.setSeconds(39);
    expect(ofClock.buildUpdate(date)).toEqual('\x02SETCOUNTER0BEEF\x03');
  });

  it('checks for argument validity', () => {
    expect(ofClock.buildUpdate.bind(undefined, 'date')).toThrow(TypeError);
  });
});

describe('buildRequest', () => {
  it('creates a valid request', () => {
    expect(ofClock.buildRequest()).toEqual('\x02GETCOUNTER\x03');
  });
});
