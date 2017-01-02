import React, { PropTypes as T } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import Radium, { Style } from 'radium';
import { gray800 } from 'material-ui/styles/colors';
import materialIcons from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const styles = {
    body: {
        fontFamily: 'Roboto, sans-serif',
        fontSmoothing: 'antialiased',
        padding: '0',
        margin: '0',
        color: gray800,
        backgroundColor: '#EFEFEF',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        FontSmoothing: 'antialiased',
        TextRendering: 'optimizeLegibility',
    },
};

class App extends React.Component {
    constructor(props) {
        super(props);

        const fontFaceMaterialIcons = `@font-face {
            font-family: 'Material Icons';
            font-style: normal;
            font-weight: 400;
            src: local('Material Icons'),
                 local('MaterialIcons-Regular'),
                 url(${materialIcons});
        }`;

        // create stylesheet
        const style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = fontFaceMaterialIcons;
        } else {
            style.appendChild(document.createTextNode(fontFaceMaterialIcons));
        }

        // inject stylesheet
        document.head.appendChild(style);
    }

    /* eslint-disable class-methods-use-this */
    get devTools() {
        if (__DEV__) {
            if (!window.devToolsExtension) {
                const DevTools = require('app/components/connected/DevTools').default;
                return <DevTools />;
            }
        }

        return undefined;
    }
    /* eslint-enable class-methods-use-this */

    get content() {
        const { history, routes, routerKey, store, actions } = this.props;
        const newProps = {
            actions,
            ...this.props,
        };

        const createElement = (Component, props) =>
            <Component {...newProps} {...props} />
    ;

        return (
            <Provider store={store}>
                <Router
                    key={routerKey}
                    routes={routes}
                    createElement={createElement}
                    history={history}
                />
            </Provider>
        );
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <div>
                    <Style rules={{ body: styles.body }} />
                    {this.content}
                    {this.devTools}
                </div>
            </Provider>
        );
    }
}

App.contextTypes = {
    router: T.object,
};

App.propTypes = {
    actions: T.object,
    history: T.object.isRequired,
    routerKey: T.number,
    routes: T.element.isRequired,
    store: T.object.isRequired,
};

export default Radium(App);
