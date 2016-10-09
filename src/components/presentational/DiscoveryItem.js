import React from 'react';
import Radium from 'radium';
import { ListItem } from 'material-ui/List';
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';

var styles = {
  listItem: {
    paddingLeft: '3.5em'
  }
};

const DiscoveryItem = ({address, onClick}) => {
  return (
    <ListItem
      style={styles.listItem}
      rightIcon={<PlayCircleFilled />}
      onClick={onClick}>
      {address}
    </ListItem>
  );
};

DiscoveryItem.propTypes = {
  address: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
};

export default Radium(DiscoveryItem);
