/* global __DEBUG__ */
// window.webkit.messageHandlers.plug_fetch.postMessage({address: '192.168.0.1', port: 5000, request: '\x03asd', callback: 'callme'});
// window.webkit.messageHandlers.plug_save.postMessage({address: '192.168.0.1', port: 5000, request: '\x03asd', callback: 'callme'});
import Raven from 'raven-js';
import ravenInit from 'raven-plugin';
import { id as releaseId } from '../release.json';

if (!__DEBUG__) {
  ravenInit(Raven);
  Raven.config('https://14c8866b68f249168a5d1877eb5e7d60@sentry.io/104807', { release: releaseId }).install();
}

const init = () => (undefined);

export default init;