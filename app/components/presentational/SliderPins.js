import React from 'react';
import Radium from 'radium';
import { grey300, grey500, grey600 } from 'material-ui/styles/colors';

const styles = {
    pinContainer: {
        display: 'inline-block',
        height: '10px',
        width: '5%',
    },
    lastPinContainer: {
        display: 'inline-block',
        height: '10px',
        width: '0',
        margingLeft: '-1px',
    },
    smallPin: {
        backgroundColor: grey300,
        height: '5px',
        width: '2px',
        marginLeft: '-1px',
    },
    largePin: {
        backgroundColor: grey500,
        height: '15px',
        width: '2px',
        marginLeft: '-1px',
    },
    number: {
        float: 'left',
        color: grey600,
    },
};

const SliderPins = ({ style, min = 0, max = 100, interval = 10, unit = '' }) => {
    styles.pinContainer.width = `${100 / (max - min)}%`;
    const pins = [];

    for (let n = min; n <= max; n += 1) {
        let containerStyle = styles.pinContainer;
        let pinStyle = styles.largePin;
        let child = (
            <div style={{ marginLeft: `${-200 * (n.toString().length + unit.length)}%` }}>
                <p style={styles.number}>{n + unit}</p>
            </div>
        );

        if (n === max) {
            containerStyle = styles.lastPinContainer;
        } else if (n % interval !== 0) {
            pinStyle = styles.smallPin;
            child = undefined;
        }

        pins.push(
            <div key={n} style={containerStyle}>
                <div style={pinStyle}>{child}</div>
            </div>,
        );
    }

    return (<div style={style}> {pins} </div>);
};

SliderPins.propTypes = {
    style: React.PropTypes.object,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    interval: React.PropTypes.number,
    unit: React.PropTypes.string,
};

export default Radium(SliderPins);
