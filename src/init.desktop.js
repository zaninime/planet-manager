import {init as plugInit} from 'protocol/plug';
import {init as discoveryInit, createDiscoveryListener} from 'protocol/discovery';
import { receiveBeacon } from 'actions/discovery';

const discoveryListenerCreator = store => (address, port) => {
  store.dispatch(receiveBeacon(address, port));
};

const checkUndefinedPath = (root, path) => {
  const inner = (root, path) => {
    if (path.length == 0) return true;
    const handle = root[path[0]];
    if (handle === undefined) return false;
    return inner(handle, path.slice(1));
  };
  path = path.split('.');
  return inner(root, path);
};

const onReady = store => {
  plugInit();
  discoveryInit();

  createDiscoveryListener().then(
    binder => binder(discoveryListenerCreator(store)),
    error => {
      /* eslint-disable no-console */
      console.warn('%cDiscovery: %can error occurred: ' + error, 'font-weight: bold, color: red', '');
      /* eslint-enable no-console */
    }
  );
};

const init = store => {
  // netcomms polyfill
  if (!checkUndefinedPath(window, 'chrome.sockets')) {
    require.ensure([], function(require) {
      require('protocol/dev').default();
      onReady(store);
    });
  } else {
    onReady(store);
  }
};

export default init;
