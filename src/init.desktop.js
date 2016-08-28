import { createDiscoveryListener } from 'protocol/discovery';
import { receiveBeacon } from 'actions/discovery';

const discoveryListenerCreator = store => (msg, {address, port}) => {
  store.dispatch(receiveBeacon(address, port));
};

const init = store => {
  createDiscoveryListener().then(
    binder => binder(discoveryListenerCreator(store)),
    error => {
      /* eslint-disable no-console */
      console.warn('%cDiscovery: %can error occurred: ' + error, 'font-weight: bold, color: red', '');
      /* eslint-enable no-console */
    }
  );
};

import * as plug from 'protocol/plug';
window.plug = plug;

export default init;
