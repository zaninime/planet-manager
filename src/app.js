/* global __DEBUG__ */

import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.css';
import './app.css';

import App from 'containers/App/App';

import {hashHistory} from 'react-router';
//import makeRoutes from './routes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

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

// protocol & discovery stuff
import {init as plugInit} from 'protocol/plug';
import {init as discoveryInit, createDiscoveryListener} from 'protocol/discovery';
import { receiveBeacon } from 'actions/discovery';

const discoveryListener = (address, port) => {
  store.dispatch(receiveBeacon(address, port));
};

const onReady = () => {
  plugInit();
  discoveryInit();

  createDiscoveryListener().then(
    binder => binder(discoveryListener),
    error => {
      /* eslint-disable no-console */
      console.warn('%cDiscovery: %can error occurred: ' + error, 'font-weight: bold, color: red', '');
      /* eslint-enable no-console */
    }
  );
};

// netcomms polyfill
if (!checkUndefinedPath(window, 'chrome.sockets')) {
  require.ensure([], function(require) {
    require('protocol/dev').default();
    onReady(); // to be removed, maybe
  });
} else {
  onReady();
}

const initialState = {};
import configureStore from './store/configureStore';
const {store, history} = configureStore({initialState, historyType: hashHistory});

let render = (routerKey = null) => {
  const makeRoutes = require('./routes').default;
  const routes = makeRoutes(store);

  const mountNode = document.querySelector('#root');
  ReactDOM.render(
    <MuiThemeProvider>
      <App history={history}
            store={store}
            routes={routes}
            routerKey={routerKey} />
    </MuiThemeProvider>, mountNode);
};

if (__DEBUG__ && module.hot) {
  const renderApp = render;
  render = () => renderApp(Math.random());

  module.hot.accept('./routes', () => render());
}

render();
