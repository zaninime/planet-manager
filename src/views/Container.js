import React, { PropTypes as T }  from 'react';
import Radium, { Style } from 'radium';
import NavigationMenu from 'containers/NavigationMenu/NavigationMenu';

var styles = {
  body: {
    backgroundColor: 'white',
    userSelect: 'none'
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

export class Container extends React.Component {
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
        <Style rules={{ body: styles.body }} />
        <div style={styles.content}>
          {this.renderChildren()}
        </div>
        <NavigationMenu lampId={this.props.params.lampId}/>
      </div>
    );
  }
}

Container.contextTypes = {
  router: T.object
};

Container.propTypes = {
  children: T.node,
  params: T.shape({
    lampId: T.string.isRequired
  })
};

export default Radium(Container);
