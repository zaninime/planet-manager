import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

const styles = {
  nfcCard: {
    overflow: 'hidden'
  },
  text: {
    paddingLeft: '5.2em',
    paddingTop: '0'
  }
};

const NfcCard = () => {
  return (
    <Card style={styles.nfcCard}>
      <CardHeader title="NFC supported" subtitle="Your device supports the NFC technology" avatar={<Avatar>N</Avatar>}/>
      <CardText style={styles.text}>Approach the lamp near the "NFC" symbol to configure it.</CardText>
    </Card>
  );
};

export default NfcCard;
