import React from 'react';
import Radium from 'radium';
import { standard } from 'release.json';
import { Link } from 'react-router';

const styles = {
    footer: {
        textTransform: 'initial',
        textAlign: 'center',
        fontSize: '0.8em',
        color: '#727272',
    },
    p: {
        margin: '3px',
    },
    about: {
        fontSize: '1.2em',
        color: '#727272',
    },
};

const Footer = () => (
    <div style={styles.footer}>
        <Link to="/about/" style={styles.about}>
            <p style={styles.p}>About us</p>
        </Link>
        <p style={styles.p}>v{standard}</p>
    </div>
);

export default Radium(Footer);
