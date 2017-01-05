import React from 'react';
import { Card } from 'material-ui/Card';
import Radium from 'radium';
import { blue500 } from 'material-ui/styles/colors';
import logo from './Header/logo.svg';

const styles = {
    headerCard: {
        position: 'fixed',
        textAlign: 'center',
        width: '100%',
        height: '140px',
        zIndex: '5',
        color: '#fff',
        backgroundColor: blue500,
        padding: '30px',
        WebkitUserSelect: 'none',
        pointerEvents: 'none',
    },
    elosLogo: {
        width: '240px',
        height: 'auto',
        margin: 'auto',
    },
    title: {
        color: 'white',
        margin: '20px 0 0 0',
    },
    planetTitle: {
        fontWeight: '100',
    },
    navSpan: {
        height: '140px',
    },
};

const Header = () =>
(
    <div>
        <Card style={styles.headerCard}>
            <div style={styles.elosLogo}>
                <img src={logo} role="presentation" />
            </div>
        </Card>
        <div style={styles.navSpan} />
    </div>
);

export default Radium(Header);
