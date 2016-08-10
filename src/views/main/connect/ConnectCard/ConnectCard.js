import React from 'react';
import { Card, CardHeader } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import styles from './styles.module.css';

const ConnectCard = () => {
  return (
    <Card className={styles.connectCard}>
			<CardHeader title="Discovered lamps" subtitle="Scanning local network..." avatar={<Avatar>D</Avatar>}/>
		</Card>
  );
};

export default ConnectCard;
