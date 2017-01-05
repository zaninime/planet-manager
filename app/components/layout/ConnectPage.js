import React from 'react';
import Radium, { StyleRoot } from 'radium';
import Header from 'app/components/layout/Header';
import ConnectCard from 'app/components/layout/ConnectCard';
import ConnectErrorDialog from 'app/components/connected/ErrorDialog';
import Footer from 'app/components/layout/Footer';

const styles = {
    container: {
        WebkitUserSelect: 'none',
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

const ConnectPage = () => (
    <div style={styles.container}>
        <Header />
        <StyleRoot style={styles.cards}>
            <ConnectCard />
            {/* <NfcCard /> */}
        </StyleRoot>
        <ConnectErrorDialog />
        <Footer />
    </div>
);

export default Radium(ConnectPage);
