/* globals describe it expect */
import * as ofConfig from './config';
import { ProtocolError } from '../errors';

describe('parseResponse', function() {
  it('parses a valid PlanetPRO Mk.I response without throwing errors', function() {
    const response = '00200830000000001000100850000000002000200830000000001000000915000000003011442332441103002003008008040150800800500000\r\n';
    expect(ofConfig.parseResponse.bind(undefined, response)).not.toThrow();
  });

  it('throws a ProtocolError for an invalid format', function() {
    const response = '002008A0000000001000100850000000002000200830000000001000000915000000003011442332441103002003008008040150800800500000\r\n';
    expect(ofConfig.parseResponse.bind(undefined, response)).toThrow(ProtocolError);
  });
});

describe('buildUpdate', function() {
  it('creates a valid configuration string', function() {
    const config = JSON.parse(`
      {
        "daylight": {
          "white": {"delay": 20,"duration": 510,"slope": 10,"intensity": 80},
          "red": {"delay": 10,"duration": 530,"slope": 20,"intensity": 80},
          "green": {"delay": 20,"duration": 510,"slope": 10,"intensity": 50},
          "blue": {"delay": 0,"duration": 555,"slope": 30,"intensity": 0}
        },
        "channels": ["white","white","blue","blue","red","green","green","red","blue","blue","white","white"],
        "temperature": {"fanStart": 30,"shutdown": 80},
        "fan": {"minSpeed": 20,"speedRamp": 30,"maxSpeed": 80},
        "night": {"color": "blue","intensity": 15},
        "mode": "slave"
      }`);
    expect(ofConfig.buildUpdate(config)).toEqual('\x02PLANETSETPARAM0100200830000000001000100850000000002000200830000000001000000915000000003011442332441103002003008008040150800800500000\x03');
  });
});

describe('buildRequest', function() {
  it('creates a valid request', function() {
    expect(ofConfig.buildRequest()).toEqual('\x02PLANETGETPARAM01\x03');
  });
});
