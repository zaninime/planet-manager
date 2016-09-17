import React from 'react';
import Radium, { StyleRoot } from 'radium';
import Header from 'views/Header/Header';
import ConnectCard from 'views/ConnectCard/ConnectCard';
import ConnectErrorDialog from 'containers/ConnectErrorDialog/ConnectErrorDialog';
// import NfcCard from 'views/NfcCard/NfcCard';
import VersionNumber from 'views/VersionNumber/VersionNumber';

var styles = {
  container: {
    userSelect: 'none'
  },
  cards: {
    maxWidth: '700px',
    margin: '20px auto 20px auto',

    '@media screen and (max-width: 720px)': {
      width: 'auto',
      marginLeft: '20px',
      marginRight: '20px'
    }
  }
};

const ConnectPage = () => {
  return (
    <div style={styles.container}>
      <Header />
      <StyleRoot style={styles.cards}>
        <ConnectCard />
        {/* <NfcCard /> */}
      </StyleRoot>
      <ConnectErrorDialog />
      <VersionNumber />
    </div>
  );
};

export default Radium(ConnectPage);
