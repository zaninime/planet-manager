import net from 'net';
import winston from 'winston';

const COMMAND_GET_STATUS = /\x02PLANETGETSTATUS01\x03/;
const COMMAND_GET_PARAM = /\x02PLANETGETPARAM01\x03/;
const COMMAND_GET_CLOCK = /\x02GETCOUNTER\x03/;
const COMMAND_GET_WIFI = /\x02WiFishGETLAN\x03/;

const COMMAND_SET_STATUS = /\x02PLANETSETSTATUS01\d{12}\x03/;
const COMMAND_SET_PARAM = /\x02PLANETSETPARAM01(\d{116})/;
const COMMAND_SET_CLOCK = /\x02SETCOUNTER[A-F0-9]{5}/;
const COMMAND_SET_WIFI = /\x02WiFishSETLAN\d{12}.{64}\d{5}5500\d{12}192168000123\d{12}2\d00\d\d{2}\x03/;

const statusString = [
    '016',  // product id
    '100',  // white level
    '099',  // red level
    '098',  // green level
    '097',  // blue level
    '050',  // fan speed
    '210',  // temperature Celsius * 10
    '100',  // link quality
    '1234', // serial
    '0116',  // firmware version
    '\r\n',
].join('');

let paramString = '085108450000000009083008450000000030085108450000000009085108450000000009112434434211030020030080' +
    '08040100520790480150\r\n';

const clockString = 'PLANETCOUNTER00000\r\n';

const wifiString = 'Home$network,obscure,192.168.5.100,5000,1,00,192.168.5.1,255.255.255.0,1\r\n';

const createServer = (host, port) => {
    const server = net.createServer(conn => {
        winston.verbose('Accepted connection', { address: conn.remoteAddress, port: conn.remotePort });
        conn.write('*HELLO*');

        conn.on('data', (data) => {
            winston.silly('Received data', { data: data.toString() });
            const stringData = data.toString();

            switch (false) {
            case !(COMMAND_GET_STATUS.test(stringData)):
                winston.info('GET status');
                conn.write(statusString);
                break;
            case !(COMMAND_GET_PARAM.test(stringData)):
                winston.info('GET params');
                conn.write(paramString);
                break;
            case !(COMMAND_GET_CLOCK.test(stringData)):
                winston.info('GET clock');
                conn.write(clockString);
                break;
            case !(COMMAND_GET_WIFI.test(stringData)):
                winston.info('GET wifi');
                conn.write(wifiString);
                break;
            case !(COMMAND_SET_STATUS.test(stringData)):
                winston.info('SET demo');
                break;
            case !(COMMAND_SET_PARAM.test(stringData)):
                {
                    const m = stringData.match(COMMAND_SET_PARAM);
                    paramString = `${m[1]}\r\n`;
                }
                winston.info('SET params');
                break;
            case !(COMMAND_SET_CLOCK.test(stringData)):
                winston.info('SET clock');
                break;
            case !(COMMAND_SET_WIFI.test(stringData)):
                winston.info('SET wifi');
                break;
            default:
                winston.warn('Invalid command received', { command: stringData });
            }
        });
    });

    server.listen({
        host,
        port,
    }, () => {
        winston.info('TCP Server ready', { host, port });
    });
};

export default createServer;
