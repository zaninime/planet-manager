/* globals describe it expect */
import * as ofClock from './clock';
import { ProtocolError } from '../errors';

describe('parseResponse', function() {
  it('parses a valid response without throwing errors', function() {
    const response = 'PLANETCOUNTER12FAB\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).not.toThrow();
  });

  it('throws a ProtocolError for an invalid format', function() {
    const response = 'PLANETCOUNTER123AG\r\n';
    expect(ofClock.parseResponse.bind(undefined, response)).toThrowError(ProtocolError);
  });
});

describe('buildUpdate', function() {
  it('creates a valid update request', function() {
    const date = new Date();
    date.setHours(13);
    date.setMinutes(34);
    date.setSeconds(39);
    expect(ofClock.buildUpdate(date)).toEqual('\x02SETCOUNTER0BEEF\x03');
  });

  it('checks for argument validity', function() {
    expect(ofClock.buildUpdate.bind(undefined, 'date')).toThrow(TypeError);
  });
});

describe('buildRequest', function() {
  it('creates a valid request', function() {
    expect(ofClock.buildRequest()).toEqual('\x02GETCOUNTER\x03');
  });
});
