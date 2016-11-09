import React from 'react';
import Radium from 'radium';
import { ListItem } from 'material-ui/List';
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';

const styles = {
    listItem: {
        paddingLeft: '3.5em',
    },
};

const DiscoveryItem = ({ address, onClick }) =>
(
    <ListItem style={styles.listItem} rightIcon={<PlayCircleFilled />} onClick={onClick}>
        {address}
    </ListItem>
);

DiscoveryItem.propTypes = {
    address: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
};

export default Radium(DiscoveryItem);
