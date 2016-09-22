/* globals __DEBUG__ */
import React, { PropTypes as T } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import Radium, { Style } from 'radium';

const styles = {
  'body': {
    fontWeight: 'lighter',
    fontFamily: 'Roboto, sans-serif',
    fontSmoothing: 'antialiased',
    padding: '0',
    margin: '0',
    color: '#404040',
    backgroundColor: '#EFEFEF',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    FontSmoothing: 'antialiased',
    TextRendering: 'optimizeLegibility'
  }
};

class App extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    history: T.object.isRequired,
    routes: T.element.isRequired,
    routerKey: T.number,
    actions: T.object
  };

  get content() {
    const { history, routes, routerKey, store, actions } = this.props;
    const newProps = {
      actions,
      ...this.props
    };

    const createElement = (Component, props) => {
      return <Component {...newProps} {...props} />;
    };

    return (
      <Provider store={store}>
        <Router
          key={routerKey}
          routes={routes}
          createElement={createElement}
          history={history} />
      </Provider>
    );
  }

  get devTools () {
    if (__DEBUG__) {
      if (!window.devToolsExtension) {
        const DevTools = require('containers/DevTools/DevTools').default;
        return <DevTools />;
      }
    }
  }

  render () {
    return (
       <Provider store={this.props.store}>
         <div>
           <Style rules={{ body:  styles.body }} />
           {this.content}
           {this.devTools}
         </div>
       </Provider>
     );
  }
}

App.propTypes = {
  store: T.object.isRequired
};

export default Radium(App);
