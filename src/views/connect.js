import React from 'react';
import Radium, { StyleRoot } from 'radium';
import Header from 'views/Header/Header';
import ConnectCard from 'views/ConnectCard/ConnectCard';
// import NfcCard from 'views/NfcCard/NfcCard';
import VersionNumber from 'views/VersionNumber/VersionNumber';

var styles = {
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

const ConnectView = () => {
  return (
    <div>
      <Header />
      <StyleRoot style={styles.cards}>
        <ConnectCard />
        {/* <NfcCard /> */}
      </StyleRoot>
      <VersionNumber />
    </div>
  );
};

export default Radium(ConnectView);
