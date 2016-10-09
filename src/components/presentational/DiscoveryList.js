import React, { Component } from 'react';
import Radium from 'radium';
import DiscoveryItem from './DiscoveryItem';
import LoadingDialog from 'components/connected/LoadingDialog';
import shallowCompare from 'react-addons-shallow-compare';

class DiscoveryList extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);

    this.state = { dialogOpen: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleOnClick(id) {
    this.setState({ dialogOpen: true });

    const { load } = this.props;
    load(id);
  }

  handleOnClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    const { lamps } = this.props;
    const handleOnClick = this.handleOnClick;

    const items = Object.keys(lamps).map((value) => {
      const lamp = lamps[value];
      const { id, address } = lamp;

      return (
        <DiscoveryItem
          key={id}
          address={address}
          onClick={() => handleOnClick(id)} />
      );
    });

    return (
      <div>
        {items}
        <LoadingDialog
          dialogOpen={this.state.dialogOpen}
          onRequestClose={this.handleOnClose} />
      </div>
    );
  }
}

DiscoveryList.propTypes = {
  lamps: React.PropTypes.array.isRequired,
  load: React.PropTypes.func.isRequired
};

export default Radium(DiscoveryList);
