/*global requireNode*/
const dgram = requireNode('dgram');


class Discovery {
	constructor() {
		this._inited = false;
	}

	initialize(settings) {
		if (this._inited) return false;
		const sock = dgram.createSocket({type: 'udp4', reuseAddr: true});
		this._sock = sock;
		sock.on('message', (msg, rinfo) => {
			settings.success({
				address: rinfo.address,
				port: rinfo.port,
				content: msg.toString('ascii')
			});
		});
		sock.on('error', (error) => {
			settings.error(error);
		});
		sock.bind(55555);
		this._inited = true;
	}

	finish() {
		if (!this._inited) return false;
		this._sock.close();
		this._inited = false;
	}
}

const discovery = new Discovery();

export {
	discovery as default
};
