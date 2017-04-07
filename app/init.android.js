import { createDiscoveryListener, init as discoveryInit } from 'app/protocol/discovery';
import { receiveBeacon } from 'app/redux/modules/discovery';
import Raven from 'raven-js';
import ravenInit from 'app/raven-plugin';
import version from 'app/version';

if (!__DEV__) {
    ravenInit(Raven);
    Raven.config('https://2ad77563f2b0445299ad43c51bcb04c8@sentry.io/104795', { release: version() }).install();
}

const discoveryListenerCreator = store => (address, port) => {
    store.dispatch(receiveBeacon(address, port));
};

const init = (store) => {
    discoveryInit();
    createDiscoveryListener().then(
    binder => binder(discoveryListenerCreator(store)),
    (error) => {
      /* eslint-disable no-console */
        console.warn(`%cDiscovery: %can error occurred: ${error}`, 'font-weight: bold, color: red', '');
      /* eslint-enable no-console */
    },
  );
};

export const BACK_BUTTON_CALLBACK_NAME = 'cb_backbtn';
export default init;
