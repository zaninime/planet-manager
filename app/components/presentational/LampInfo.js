import React from 'react';
import Radium from 'radium';

const styles = {
    table: {
        margin: 'auto',
        textAlign: 'left',
        borderSpacing: '1em 0.5em',
    },
    headerCell: {
        textAlign: 'right',
    },
};

const LampInfo = ({ model, firmwareVersion }) => (
    <table style={styles.table}>
        <tbody>
            <tr>
                <th style={styles.headerCell}>Lamp Model</th>
                <td>{model}</td>
            </tr>
            <tr>
                <th style={styles.headerCell}>Firmware Version</th>
                <td>{firmwareVersion}</td>
            </tr>
        </tbody>
    </table>
);

LampInfo.propTypes = {
    firmwareVersion: React.PropTypes.number.isRequired,
    model: React.PropTypes.string.isRequired,
};

export default Radium(LampInfo);
