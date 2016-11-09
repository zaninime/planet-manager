import React from 'react';
import Radium, { StyleRoot } from 'radium';
import Header from 'app/components/layout/Header';
import ConnectCard from 'app/components/layout/ConnectCard';
import ConnectErrorDialog from 'app/components/connected/ErrorDialog';
import VersionNumber from 'app/components/layout/VersionNumber';

const styles = {
    container: {
        userSelect: 'none',
    },
    cards: {
        maxWidth: '700px',
        margin: '20px auto 20px auto',

        '@media screen and (max-width: 720px)': {
            width: 'auto',
            marginLeft: '20px',
            marginRight: '20px',
        },
    },
};

const ConnectPage = () =>
(
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

export default Radium(ConnectPage);
