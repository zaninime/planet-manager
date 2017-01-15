import React from 'react';
import Radium from 'radium';
import version from 'app/version';

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
    <p style={styles.version}>v{version()}</p>
);

export default Radium(VersionNumber);
