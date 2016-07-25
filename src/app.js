import React from 'react'
import ReactDOM from 'react-dom'

import 'font-awesome/css/font-awesome.css'
import './app.css'

import App from 'containers/App/App'

import {hashHistory} from 'react-router'
import makeRoutes from './routes'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const initialState = {}
import {configureStore} from './redux/configureStore'
const {store, actions, history} = configureStore({initialState, historyType: hashHistory});

let render = (routerKey = null) => {
  const makeRoutes = require('./routes').default;
  const routes = makeRoutes(store)

  const mountNode = document.querySelector('#root');
  ReactDOM.render(
    <MuiThemeProvider>
      <App history={history}
            store={store}
            actions={actions}
            routes={routes}
            routerKey={routerKey} />
    </MuiThemeProvider>, mountNode);
}

if (__DEBUG__ && module.hot) {
  const renderApp = render;
  render = () => renderApp(Math.random())

  module.hot.accept('./routes', () => render());
}

render();
