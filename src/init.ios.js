window.webkit.messageHandlers.plug_fetch.postMessage({address: '192.168.0.1', port: 5000, request: '\x03asd', callback: 'callme'});
window.webkit.messageHandlers.plug_save.postMessage({address: '192.168.0.1', port: 5000, request: '\x03asd', callback: 'callme'});

const init = () => (undefined);

export default init;