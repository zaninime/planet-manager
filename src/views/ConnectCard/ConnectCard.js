import React from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import Radium from 'radium';
import Avatar from 'material-ui/Avatar';
import TimedDiscoveryList from 'components/TimedDiscoveryList/TimedDiscoveryList';
import Divider from 'material-ui/Divider';
import List from 'material-ui/List';
import ManualConnectionItem from '../ManualConnectionItem/ManualConnectionItem';

var styles = {
  connectCard: {
    marginBottom: '20px',
    overflow: 'hidden'
  }
};

const ConnectCard = () => {
  return (
      <Card style={styles.connectCard}>
        <CardHeader
          title="Discovered lamps"
          subtitle="Scanning local network..."
          avatar={<Avatar>D</Avatar>} />
        <List>
          <TimedDiscoveryList />
          <Divider inset={true} />
          <ManualConnectionItem />
        </List>
      </Card>
  );
};

export default Radium(ConnectCard);
