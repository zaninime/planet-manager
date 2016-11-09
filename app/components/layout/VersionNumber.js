import React from 'react';
import Radium from 'radium';
import { versionCode } from '../../../package.json';

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
    <p style={styles.version}>v{versionCode.standard}</p>
);

export default Radium(VersionNumber);
