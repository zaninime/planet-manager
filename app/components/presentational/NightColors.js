import React, { Component } from 'react';
import Radium from 'radium';
import FlatButton from 'material-ui/FlatButton';
import { blueGrey100, blueGrey400, blue100, blue400 } from 'material-ui/styles/colors';
import shallowCompare from 'react-addons-shallow-compare';

const colors = ['white', 'blue'];

const colorProperties = {
    whiteDisabled: blueGrey100,
    whiteBackground: blueGrey400,
    whiteLabelColor: 'white',

    blueDisabled: blue100,
    blueBackground: blue400,
    blueLabelColor: 'white',
};

const styles = {
    flatButton: {
        margin: '0px 30px 30px 30px',
    },
};

class NightColors extends Component {
    static enableButton(color) {
        const newState = { };
        for (let i = 0; i < colors.length; i += 1) {
            const property = colors[i] === color ? 'Background' : 'Disabled';
            newState[`${colors[i]}Background`] = colorProperties[colors[i] + property];
        }

        return newState;
    }

    static initState(props) {
        return {
            selected: props.color,
            ...NightColors.enableButton(props.color),
        };
    }

    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);

        this.state = NightColors.initState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(NightColors.initState(nextProps));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    handleOnClick(e, color) {
        e.stopPropagation();

        this.setState({ selected: color, ...NightColors.enableButton(color) });
        this.props.setColor(color);
    }

    render() {
        const buttons = colors.map((color) => {
            const labelColor = colorProperties[`${color}LabelColor`];

            return (
                <FlatButton
                    style={styles.flatButton}
                    key={color}
                    label={color}
                    hoverColor={this.state[`${color}Background`]}
                    backgroundColor={this.state[`${color}Background`]}
                    labelStyle={{ color: labelColor }}
                    onClick={e => this.handleOnClick(e, color)}
                />
            );
        });

        return (
            <div> {buttons} </div>
        );
    }
}

/* eslint-disable */
NightColors.propTypes = {
    color: React.PropTypes.string.isRequired,
    setColor: React.PropTypes.func.isRequired,
};

export default Radium(NightColors);
