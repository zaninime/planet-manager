import React from 'react';
import Radium, { StyleRoot } from 'radium';
import Header from '../connect/Header/Header';
import ConnectCard from '../connect/ConnectCard/ConnectCard';
// import NfcCard from '../connect/NfcCard/NfcCard';
import VersionNumber from '../connect/VersionNumber/VersionNumber';

var styles = {
  connectCard: {
    maxWidth: '700px',
    margin: '20px auto 20px auto',

    '@media screen and (max-width: 720px)': {
      width: 'auto',
      marginLeft: '20px',
      marginRight: '20px'
    }
  }
};

const ConnectView = () => {
  return (
    <div>
      <Header />
      <StyleRoot style={styles.connectCard}>
        <ConnectCard />
        {/* <NfcCard /> */}
      </StyleRoot>
      <VersionNumber />
    </div>
  );
};

export default Radium(ConnectView);
