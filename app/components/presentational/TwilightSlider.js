import React, { Component } from 'react';
import Radium from 'radium';
import CircleGradientIcon from 'app/components/presentational/CircleGradientIcon';
import SliderButton from 'app/components/presentational/SliderButton';
import shallowCompare from 'react-addons-shallow-compare';
import SunIcon from './SunIcon';
import CloudIcon from './CloudIcon';

const styles = {
    container: {
        position: 'relative',
        margin: 'auto',
    },
    slider: { },
    sunIcon: {
        position: 'absolute',
        left: '0px',
        right: '0',
        bottom: '0px',
        top: '0',
        margin: 'auto',
        width: '100px',
        height: 'auto',
    },
    cloudIcon1: {
        position: 'absolute',
        left: '0',
        right: '60px',
        top: '40px',
        bottom: '0',
        margin: 'auto',
        width: '120px',
        height: 'auto',
    },
    cloudIcon2: {
        position: 'absolute',
        left: '50px',
        right: '0',
        top: '50px',
        bottom: '20px',
        margin: 'auto',
        width: '120px',
        height: 'auto',
        opacity: '0',
    },
    cloudIcon3: {
        position: 'absolute',
        left: '0',
        right: '20px',
        top: '0',
        bottom: '30px',
        margin: 'auto',
        width: '120px',
        height: 'auto',
    },
};

class TwilightSlider extends Component {
    static setIconsOpacity(value) {
        let newState = { };

        if (value <= 0.33) {
            newState = { cloudOpacity1: 1, cloudOpacity2: 1, cloudOpacity3: 1 - (value / 0.33) };
        } else if (value <= 0.66) {
            newState = { cloudOpacity1: 1, cloudOpacity2: 1 - ((value - 0.33) / 0.33), cloudOpacity3: 0 };
        } else if (value <= 1.00) {
            newState = { cloudOpacity1: 1 - ((value - 0.66) / 0.34), cloudOpacity2: 0, cloudOpacity3: 0 };
        }

        return { ...newState, sunOpacity: Math.max(value, 0.25) };
    }

    static initState(props) {
        return {
            value: props.twilightValue,
            ...TwilightSlider.setIconsOpacity(props.twilightValue),
        };
    }

    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnRelease = this.handleOnRelease.bind(this);

        this.state = TwilightSlider.initState(props);

        this.radius = 140;
        this.buttonRadius = 20;
        this.firstColor = 'white';
        this.secondColor = '#EB490B';

        styles.slider.width = this.radius * 2;
        styles.slider.height = this.radius * 2;
        styles.slider.borderRadius = this.radius;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(TwilightSlider.initState(nextProps));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    handleOnChange(value) {
        this.setState(TwilightSlider.setIconsOpacity(value));
    }

    handleOnRelease(value) {
        this.props.setValue(value);
    }

    render() {
        const sunStyle = { ...styles.sunIcon, opacity: this.state.sunOpacity };
        const cloudStyle1 = { ...styles.cloudIcon1, opacity: this.state.cloudOpacity1 };
        const cloudStyle2 = { ...styles.cloudIcon2, opacity: this.state.cloudOpacity2 };
        const cloudStyle3 = { ...styles.cloudIcon3, opacity: this.state.cloudOpacity3 };

        return (
            <div style={styles.container}>
                <CircleGradientIcon
                    style={styles.slider}
                    radius={this.radius}
                    borderWidth={this.buttonRadius * 2}
                    firstColor={this.firstColor}
                    secondColor={this.secondColor}
                />
                <SliderButton
                    value={this.state.value}
                    radius={this.radius}
                    buttonRadius={this.buttonRadius - 2}
                    onChange={this.handleOnChange}
                    onRelease={this.handleOnRelease}
                />
                <SunIcon style={sunStyle} />

                <CloudIcon style={cloudStyle1} />
                <CloudIcon style={cloudStyle2} />
                <CloudIcon style={cloudStyle3} />
            </div>
        );
    }
}

/* eslint-disable*/
TwilightSlider.propTypes = {
    twilightValue: React.PropTypes.number.isRequired,
    setValue: React.PropTypes.func.isRequired,
};

export default Radium(TwilightSlider);
