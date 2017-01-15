import { createDiscoveryListener } from 'app/protocol/discovery';
import { receiveBeacon } from 'app/redux/modules/discovery';
import Raven from 'raven-js';
import ravenInit from 'app/raven-plugin';
import version from 'app/version';

if (!__DEV__) {
    ravenInit(Raven);
    Raven.config('https://f850a2c7562843caa6389f3a3fca71a1@sentry.io/104808', { release: version() }).install();
}

const discoveryListenerCreator = store => (msg, { address, port }) => {
    store.dispatch(receiveBeacon(address, port));
};

const init = (store) => {
    createDiscoveryListener().then(
    binder => binder(discoveryListenerCreator(store)),
    (error) => {
      /* eslint-disable no-console */
        console.warn(`%cDiscovery: %can error occurred: ${error}`, 'font-weight: bold, color: red', '');
      /* eslint-enable no-console */
    },
  );
};

export default init;
