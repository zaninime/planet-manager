import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// import 'font-awesome/css/font-awesome.css';

import App from 'app/components/connected/App';

import { hashHistory } from 'react-router';
// import makeRoutes from './routes';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';


import configureStore from 'app/redux/configureStore';

import platformInit from 'app/init';

import { blue500, blue800, orangeA400 } from 'material-ui/styles/colors';

const initialState = {};
const { store, history } = configureStore({ initialState, historyType: hashHistory });
platformInit(store);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500,
        primary2Color: blue800,
        accent1Color: orangeA400,
    },
});

let render = (routerKey = null) => {
    const match = window.location.hash.match(/#(.+)\?/);
    if (match && match[1] !== '/') {
        window.location = window.location.origin + window.location.pathname;
        throw new Error('You should not get here');
    }

    // ensure viewport is correctly sized
    const viewportTag = document.createElement('meta');
    viewportTag.name = 'viewport';
    viewportTag.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(viewportTag);

    const makeRoutes = require('./routes').default;
    const routes = makeRoutes(store);

    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
    // const mountNode = document.querySelector('#root');
    ReactDOM.render(
        <MuiThemeProvider muiTheme={muiTheme}>
            <App
                history={history}
                store={store}
                routes={routes}
                routerKey={routerKey}
            />
        </MuiThemeProvider>, mountNode);
};

if (__DEV__ && module.hot) {
    const renderApp = render;
    render = () => renderApp(Math.random());

    module.hot.accept('./routes', () => render());
}

render();
