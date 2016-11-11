import ExtensibleError from 'app/utils/error';

export class IOError extends ExtensibleError {}
export class ProtocolError extends ExtensibleError {}

export const createIOError = (cause, ...args) => {
    switch (cause) {
    case 'CONNECT':
        return new IOError(`Couldn't connect to remote host, error: ${args[0]}`);
    case 'SEND':
        return new IOError(`Couldn't send data to remote host, error: ${args[0]}`);
    case 'BIND':
        return new IOError(`Couldn't bind socket, error: ${args[0]}`);
    case 'TIMEOUT':
        return new IOError('I/O operation timed out');
    case 'NATIVE':
        return new IOError(args[0]);
    default:
        throw new Error('Invalid cause');
    }
};

/* istanbul ignore next */
export const createProtocolError = message =>
   new ProtocolError(message)
;