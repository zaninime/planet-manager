import React, { Component } from 'react';
import Radium from 'radium';
import DiscoveryItem from '../DiscoveryItem/DiscoveryItem';
import LoadingDialog from 'views/LoadingDialog/LoadingDialog';

class DiscoveryList extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);

    this.state = { dialogOpen: false };
  }

  handleOnClick(id) {
    this.setState({ dialogOpen: true });

    const { load } = this.props;
    load(id);
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
        <LoadingDialog dialogOpen={this.state.dialogOpen}/>
      </div>
    );
  }
}

DiscoveryList.propTypes = {
  lamps: React.PropTypes.array.isRequired,
  load: React.PropTypes.func.isRequired
};

export default Radium(DiscoveryList);
