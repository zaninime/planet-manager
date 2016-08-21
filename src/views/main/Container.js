import React, { PropTypes as T }  from 'react';
import Radium, { Style } from 'radium';
import BoundNavigationMenu from 'containers/common/BoundNavigationMenu/BoundNavigationMenu';

var styles = {
  'body':{
    backgroundColor: 'white'
  },
  wrapper : { },
  content: {
    position: 'fixed',
    top: '0px',
    bottom: '56px',
    width: '100%',
    overflowY: 'auto'
  }
};

export class ConfigPage extends React.Component {
  renderChildren() {
    const childProps = {
      ...this.props
    };
    const {children} = this.props;

    return React.Children.map(children, c => React.cloneElement(c, childProps));
  }
  render() {
    return (
      <div style={styles.wrapper}>
        <Style rules={{ body:  styles.body }} />
        <div style={styles.content}>
          {this.renderChildren()}
        </div>
        <BoundNavigationMenu />
      </div>
    );
  }
}

ConfigPage.contextTypes = {
  router: T.object
};

ConfigPage.propTypes = {
  children: T.node
};

export default Radium(ConfigPage);
