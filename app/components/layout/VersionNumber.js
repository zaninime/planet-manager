import React from 'react';
import Radium from 'radium';
import { standard } from 'release.json';
import { Link } from 'react-router';

const styles = {
    version: {
        textTransform: 'initial',
        textAlign: 'center',
        fontSize: '0.8em',
        color: '#727272',
    },
};

const VersionNumber = () =>
(
    <p style={styles.version}>v{standard} <Link to="/about/">About</Link></p>
);

export default Radium(VersionNumber);
