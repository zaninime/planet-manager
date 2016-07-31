import { str2ab, ab2str } from './arraybuffer';
import * as ofClock from './data/clock';

let nextTcpSocket = 0;
let nextUdpSocket = 0;
const tcpSockets = {};
const udpSockets = {};
const delay = 1000;          // simulated base delay for development (ms)

class GenericEventEmitter {
  constructor() {
    this.listeners = [];
  }

  addListener(fun) {
    this.listeners.push(fun);
  }

  removeListener(fun) {
    this.listeners = this.listeners.filter((e) => e !== fun);
  }

  emit(...args) {
    for (let fun of this.listeners) {
      fun(...args);
    }
  }
}

const tcp = {
  create(props, cb) {
    tcpSockets[nextTcpSocket] = {connected: false};
    cb({socketId: nextTcpSocket++});
  },

  setNoDelay(_1, _2, cb) {
    cb(0);
  },

  connect(socketId, peerAddress, peerPort, cb) {
    if (socketId >= nextTcpSocket) throw "invalid socketId";
    if (peerPort !== 5000) throw "can't connect to non-lamps";
    const socket = tcpSockets[socketId];
    if (socket === undefined) throw "connect() called on a closed socket";
    if (socket.connected) throw "connect() called on a connected socket";
    setTimeout(() => {
      tcpSockets[socketId] = {...socket, connected: true, address: peerAddress, port: peerPort};
      cb(0);
      tcp.onReceive.emit({socketId, data: str2ab("*HELLO*")});
    }, delay+ 100 + Math.random() * 100);
  },

  close(socketId, cb) {
    if (socketId >= nextTcpSocket) throw "invalid socketId";
    const socket = tcpSockets[socketId];
    if (socket === undefined) throw "close() called on an invalidated socket";
    setTimeout(() => {
      tcpSockets[socketId] = undefined;
      cb(0);
    }, delay + 50);
  },

  send(socketId, data, cb) {
    if (socketId >= nextTcpSocket) throw "invalid socketId";
    const socket = tcpSockets[socketId];
    if (socket === undefined)  throw "send() called on an invalidated socket";
    if (!socket.connected) throw "send() called on a non-connected socket";
    cb(0, data.length);
    data = ab2str(data).slice(1, -1);
    switch (false) {
      case !/^PLANETSETPARAM01/.test(data):
      case !/^PLANETSETSTATUS01/.test(data):
      case !/^SETCOUNTER/.test(data):
        // set commands, do not respond
        break;
      case !/^PLANETGETPARAM01$/.test(data):
        tcp.onReceive.emit({socketId, data: str2ab('00200830000000001000100850000000002000200830000000001000000915000000003011442332441103002003008008040150800800500000\r\n')});
        break;
      case !/^PLANETGETSTATUS01$/.test(data):
        tcp.onReceive.emit({socketId, data: str2ab('01600000000001500023710000000114\r\n')});
        break;
      case !/^GETCOUNTER$/.test(data): {
        const date = new Date();
        date.setSeconds(Math.random() * 240 - 120);
        const update = ofClock.buildUpdate(date).slice(4, -1);
        tcp.onReceive.emit({socketId, data: str2ab(`PLANET${update}\r\n`)});
        break;
      }
      default:
        throw `Watch your ass baby! You just sent out an unrecognized command: '${data}'`;
    }
  },

  onReceive: new GenericEventEmitter(),
  onReceiveError: new GenericEventEmitter()
};

const udp = {
  create(properties, cb) {
    udpSockets[nextUdpSocket] = {bound: false};
    cb({socketId: nextUdpSocket++});
  },

  bind(socketId, address, port, cb) {
    if (socketId >= nextUdpSocket) throw "invalid socketId";
    const socket = udpSockets[socketId];
    if (socket === undefined) throw "bind() called on an invalidated socket";
    if (socket.bound) throw "bind() called on a bound socket";
    if (port !== 55555) throw "Sorry, just lamp discovery is implemented";
    socket.bound = true;
    socket.address = address;
    socket.port = port;
    cb(0);
  },

  close(socketId, cb) {
    if (socketId >= nextUdpSocket) throw "invalid socketId";
    const socket = udpSockets[socketId];
    if (socket === undefined) throw "close() called on an invalidated socket";
    udpSockets[socketId] = undefined;
    cb(0);
  },

  setBroadcast(socketId, enabled, cb) {
    if (socketId >= nextUdpSocket) throw "invalid socketId";
    const socket = udpSockets[socketId];
    if (socket === undefined) throw "setBroadcast() called on an invalidated socket";
    socket.broadcast = true;
    cb(0);
  },

  onReceive: new GenericEventEmitter(),
  onReceiveError: new GenericEventEmitter()
};

const discoveryEmitter = (emitter, sockets) => () => {
  if (Math.random() < .3) return;
  for (let socketId of Object.keys(sockets)) {
    const sockData = sockets[socketId];
    if (sockData.bound && sockData.broadcast) {
      emitter.emit({socketId, data: str2ab('WiFish'), remoteAddress: '6.1.2.3', remotePort: 5000});
    }
  }
};

const enableDev = () => {
  /* eslint-disable no-console */
  console.warn('%cEnabling Chrome\'s Network Communications polyfill. %cThis feature is a development tool, not suitable for production.', 'color: #673AB7; font-weight: bold;', '');
  /* eslint-enable no-console */
  window['chrome'] = {...window['chrome'],
    sockets: {
      tcp, udp
    }
  };

  setInterval(discoveryEmitter(udp.onReceive, udpSockets), 7500);
};

export default enableDev;
