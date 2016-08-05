import { createDiscoveryListener } from 'protocol/discovery';
import { receiveBeacon } from 'reducers/discovery';

const discoveryListenerCreator = store => (address, port) => {
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

export default init;
