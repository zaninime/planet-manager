import React, { PropTypes as T } from 'react';
import Radium from 'radium';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {
  red400,
  red500,
  green400,
  green500,
  blue400,
  blue500,
  blueGrey200,
  blueGrey300,
} from 'material-ui/styles/colors';

const colors = {
    redBackground: red400,
    redHover: red500,
    redText: 'white',

    greenBackground: green400,
    greenHover: green500,
    greenText: 'white',

    blueBackground: blue400,
    blueHover: blue500,
    blueText: 'white',

    whiteBackground: blueGrey200,
    whiteHover: blueGrey300,
    whiteText: 'white',

    offBackground: undefined,
    offHover: undefined,
    offText: undefined,
};

const labels = {
    red: 'red',
    green: 'green',
    blue: 'blue',
    white: 'white',
    off: 'off',
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1em',
    },
    stripNumber: {
        width: '10%',
        margin: 'auto',
        textAlign: 'center',
    },
    toggle: {
        width: '30%',
        margin: 'auto',
    },
    toggleLeft: {
        textAlign: 'right',
    },
    toggleRight: {
        textAlign: 'left',
    },
    colorButton: {
        margin: 'auto',
        textAlign: 'center',
    },
    innerColorButton: {},
};

class ChannelColor extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggleEnable = this.handleToggleEnable.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleToggleEnable(_, e) {
        const { stripNumber } = this.props;
        if (e) this.props.enableStrip(stripNumber);
        else this.props.disableStrip(stripNumber);
    }

    handleButtonClick() {
        const { stripNumber } = this.props;
        this.props.nextStripColor(stripNumber);
    }

    render() {
        let { color } = this.props;
        const { enabled, reverse, stripNumber } = this.props;
        if (!enabled) {
            color = 'off';
        }
        const backgroundColor = colors[`${color}Background`];
        const hoverColor = colors[`${color}Hover`];
        const textColor = colors[`${color}Text`];
        const label = labels[color];

        const colorButton = (
            <FlatButton
                label={label}
                backgroundColor={backgroundColor}
                hoverColor={hoverColor}
                labelStyle={{ color: textColor }}
                disabled={!enabled}
                style={styles.innerColorButton}
                onClick={this.handleButtonClick}
            />
        );

        const toggle = (
            <Checkbox checked={enabled} onCheck={this.handleToggleEnable} iconStyle={{ margin: '0 auto 0 auto' }} />
        );

        if (reverse) {
            return (
                <div style={styles.container}>
                    <div style={styles.stripNumber}>{stripNumber}</div>
                    <div style={[styles.toggle, styles.toggleRight]}>{toggle}</div>
                    <div style={styles.colorButton}>{colorButton}</div>
                </div>
            );
        }

        return (
            <div style={styles.container}>
                <div style={styles.colorButton}>{colorButton}</div>
                <div style={[styles.toggle, styles.toggleRight]}>{toggle}</div>
                <div style={styles.stripNumber}>{stripNumber}</div>
            </div>
        );
    }
}

export default Radium(ChannelColor);

ChannelColor.propTypes = {
    color: (props, name, component) => {
        if (props[name] === undefined) return;
        if (!/^(?:red|green|blue|white)$/.test(props[name])) {
            throw new Error(`Invalid prop 'color' supplied to ${component}. Must be one of {red, green, blue, white}`);
        }
    },
    enabled: T.bool,
    reverse: T.bool,
    stripNumber: T.number.isRequired,
    enableStrip: T.func.isRequired,
    disableStrip: T.func.isRequired,
    nextStripColor: T.func.isRequired,
};
