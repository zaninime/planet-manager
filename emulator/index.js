import commander from 'commander';
import winston from 'winston';

import createDiscoveryBroadcast from './discovery';
import createServer from './lampProtocol';

const main = () => {
    commander
        .option(
            '-l, --loglevel [level]',
            'Set log level (error, warn, info, verbose, debug, silly). Default: info',
            'info',
        )
        .option('-h, --host [host]', 'Listening host', '0.0.0.0')
        .option('-p, --port [port]', 'Listening port', parseInt, 5000)
        .parse(process.argv);

    winston.level = commander.loglevel;
    winston.cli();

    const { host, port } = commander;

    createServer(host, port);
    createDiscoveryBroadcast(host, port);
};

main();
