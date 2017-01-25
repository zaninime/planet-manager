import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/components/connected/App';

import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from 'app/redux/configureStore';

import platformInit from 'app/init';

import { blue500, blue800, orangeA400 } from 'material-ui/styles/colors';

import routes from 'app/routes';

// RxJS operators
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/toArray';

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

const render = (routerKey = null) => {
    let mountNode = document.querySelector('#root');

    if (mountNode === null) {
        // fresh load of the application

        // before proceeding, check that we start from the connect page
        const match = window.location.hash.match(/#(.+)/);
        if (match && match[1] !== '/') {
            window.location = window.location.origin + window.location.pathname;
            return;
        }

        // create the root node
        mountNode = document.createElement('div');
        mountNode.id = 'root';
        document.body.appendChild(mountNode);

        // ensure viewport is correctly sized
        const viewportTag = document.createElement('meta');
        viewportTag.name = 'viewport';
        viewportTag.content = 'width=device-width, initial-scale=1';
        document.head.appendChild(viewportTag);
    }

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

render();
