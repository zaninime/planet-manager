import React from 'react';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        maxWidth: '25em',
    },
    text: {
        flexGrow: 1,
    },
};

const MODE_STRING_MAP = {
    master: 'Acting as the master lamp',
    slave: 'Acting as a slave lamp',
};

const ACTION_STRING_MAP = {
    master: 'Make slave',
    slave: 'Make master',
};

const OperationModeSwitch = ({ mode, onSwitch }) => (
    <div style={styles.container}>
        <div style={styles.text}>
            {MODE_STRING_MAP[mode]}
        </div>
        <div>
            <RaisedButton label={ACTION_STRING_MAP[mode]} onClick={onSwitch} />
        </div>
    </div>
);

OperationModeSwitch.propTypes = {
    mode: React.PropTypes.oneOf(['master', 'slave']).isRequired,
    onSwitch: React.PropTypes.func,
};

export default Radium(OperationModeSwitch);
