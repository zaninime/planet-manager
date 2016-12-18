import React from 'react';
import Radium from 'radium';

const styles = {
    table: {
        margin: 'auto',
    },
};

const LampInfo = ({ model, firmwareVersion }) => (
    <table style={styles.table}>
        <tbody>
            <tr>
                <th>Model</th>
                <td>{model}</td>
            </tr>
            <tr>
                <th>Firmware Version</th>
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
