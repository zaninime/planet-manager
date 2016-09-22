/* global __DEBUG__ */

import { browserHistory } from 'react-router';
//import { bindActionCreatorsToStore } from 'redux-module-builder';
//import { createApiMiddleware } from 'redux-module-builder/api';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

const configureStore = ({
  historyType = browserHistory,
  userInitialState = {}}) => {

  const middleware = [
      // createApiMiddleware({
      //   baseUrl: __ROOT_URL__,
      //   headers: {
      //     'X-Requested-By': 'planet-manager client'
      //   }
      // }),
    thunk,
    routerMiddleware(historyType)
  ];

  const tools = [];
  if (__DEBUG__) {
    const DevTools = require('containers/DevTools/DevTools').default;
    const devTools = window.devToolsExtension ? window.devToolsExtension : DevTools.instrument;
    if (typeof devTools === 'function') {
      tools.push(devTools());
    }
  }

  const finalCreateStore = compose(
      applyMiddleware(...middleware),
      ...tools
    )(createStore);

  const store = finalCreateStore(rootReducer, {...userInitialState});

  const history = syncHistoryWithStore(historyType, store, {
    adjustUrlOnReplay: true
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const rootReducer = require('../reducers');
      store.replaceReducer(rootReducer);
    });
  }

    //const boundActions = bindActionCreatorsToStore(actions, store);
  return {store, history};
};

export default configureStore;
