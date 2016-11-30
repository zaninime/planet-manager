import dgram from 'dgram';
import winston from 'winston';

const createDiscoveryBroadcast = (host, port) => {
    const socket = dgram.createSocket('udp4');

    const sendPacket = () => {
        socket.send('WiFly', 55555, '255.255.255.255');
    };

    socket.bind(port, host, () => {
        winston.info('Discovery protocol enabled', { host, port });
        socket.setBroadcast(true);
        sendPacket();
        setInterval(() => {
            sendPacket();
        }, 7500);
    });
};

export default createDiscoveryBroadcast;
