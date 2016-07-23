/*global requireNode*/
import data from './data.coffee';

const net = requireNode('net');

function unpackCounter(str) {
	let match, re;
	re = /^PLANETCOUNTER([0-9A-F]{5})/;
	match = str.match(re);
	if (match === null) {
		return {
			status: 'error',
			message: 'Response doesn\'t match the required format'
		};
	}
	return {
		status: 'success',
		value: parseInt(match[1], 16)
	};
}

function packCounter(counter) {
	counter = parseInt(counter);
	counter = counter % 86400;
	if (counter < 0) {
		counter += 86400;
	}
	counter = counter.toString(16).toUpperCase();
	for (let i = counter.length; i < 5; i++) {
		counter = `0${counter}`;
	}
	return counter;
}

export default class WiFi {
	constructor(address, port) {
		this._address = address;
		this._port = port;
	}

	_getGeneric(baseStr, settings) {
		const reqString = `\x02${ baseStr }\x03`;
		const sock = net.createConnection({
			host: this._address,
			port: this._port
		});
		sock.setNoDelay();
		sock.setEncoding('ASCII');
		sock.setTimeout(5000);
		let state = 0;
		sock.on('data', (data) => {
			if (state === 0) {
				if (data !== '*HELLO*') {
					settings.error({type: 'ProtocolError', message: 'Unable to complete handshake', action: 'Handshaking'});
					return;
				}
				state = 1;
				sock.write(reqString);
				return;
			}
			if (state === 1) {
				state = 2;
				sock.destroy();
				settings.success(data);
			}
		});
		sock.on('error', (error) => {
			sock.destroy();
			settings.error({name: error.code, message: error.message});
		});
		sock.on('timeout', () => {
			sock.destroy();
			settings.error({name: 'ETIMEOUT', message: 'Connection timed out'});
		});
	}

	_setGeneric(baseStr, settings, data) {
		const reqString = `\x02${ baseStr }${ data }\x03`;
		const sock = net.createConnection({
			host: this._address,
			port: this._port
		});
		sock.setNoDelay();
		sock.setEncoding('ASCII');
		sock.setTimeout(5000);
		let state = 0;
		sock.on('data', (data) => {
			if (state === 0) {
				if (data !== '*HELLO*') {
					settings.error({type: 'ProtocolError', message: 'Unable to complete handshake', action: 'Handshaking'});
					return;
				}
				state = 1;
				sock.write(reqString);
				sock.destroy();
				if (typeof settings.success == 'function') {
					settings.success();
				}
				return;
			}
		});
		sock.on('error', (error) => {
			sock.destroy();
			settings.error({name: error.code, message: error.message});
		});
		sock.on('timeout', () => {
			sock.destroy();
			settings.error({name: 'ETIMEOUT', message: 'Connection timed out'});
		});
	}

getParam(settings) {
	if (settings.success === undefined) return;
	this._getGeneric('PLANETGETPARAM01', {
		success: (resp) => {
			settings.success({
				raw: resp,
				decoded: data.Config.parseString(resp)
			});
		},
		error: settings.error
	});
}
setParam(settings) {
	this._setGeneric('PLANETSETPARAM01', settings, settings.config.socketify());
}

getStatus(settings) {
	if (settings.success === undefined) return;
	this._getGeneric('PLANETGETSTATUS01', {
		success: (resp) => {
			settings.success({
				raw: resp,
				decoded: data.StatusResponse.parseString(resp)
			});
		},
		error: settings.error
	});
}
setStatus(settings) {
	this._setGeneric('PLANETSETSTATUS01', settings, settings.status.socketify());
}

getCounter(settings) {
	if (settings.success === undefined) return;
	this._getGeneric('GETCOUNTER', {
		success: (resp) => {
			settings.success({
				raw: resp,
				decoded: unpackCounter(resp)
			});
		},
		error: settings.error
	});
}
setCounter(settings) {
	this._setGeneric('SETCOUNTER', settings, packCounter(settings.counter));
}

getWLAN(settings) {
	if (settings.success === undefined) return;
	this._getGeneric('WiFishGETLAN', {
		success: (resp) => {
			settings.success({
				raw: resp,
				decoded: data.WiFiConfig.parseString(resp)
			});
		}
	});
}
setWLAN(settings) {
	this._setGeneric('WiFishSETLAN', settings, settings.config.socketify());
}
}
