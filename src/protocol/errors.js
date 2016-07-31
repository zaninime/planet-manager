import ExtensibleError from 'utils/error';

export class IOError extends ExtensibleError {}
export class ProtocolError extends ExtensibleError {}

/* istanbul ignore next */
export const createIOError = (cause, ...args) => {
  switch (cause) {
    case 'CONNECT':
      return new IOError(`Couldn't connect to remote host, error: ${args[0]}`);
    case 'SEND':
      return new IOError(`Couldn't send data to remote host, error: ${args[0]}`);
    case 'BIND':
      return new IOError(`Couldn't bind socket, error: ${args[0]}`);
    default:
      throw 'Invalid cause';
  }
};

/* istanbul ignore next */
export const createProtocolError = (message) => {
  return new ProtocolError(message);
};
