import React, { Component } from 'react';
import Radium from 'radium';
import CircleGradientIcon from 'app/components/presentational/CircleGradientIcon';
import SliderButton from 'app/components/presentational/SliderButton';
import { GradientReader } from 'app/utils/gradient';
import shallowCompare from 'react-addons-shallow-compare';
import DayGradientIcon from './DayGradientIcon';

const styles = {
    container: {
        position: 'relative',
        margin: 'auto',
    },
    centered: {
        margin: 'auto',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    colorSlider: { },
    intensitySlider: {
        margin: 'auto',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
};

class DaySlider extends Component {
    constructor(props) {
        super(props);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleIntensityChange = this.handleIntensityChange.bind(this);

        this.colorRadius = 140;
        this.intensityRadius = 90;
        this.buttonRadius = 20;

        this.firstColor = '#EB490B';
        this.secondColor = '#E2E095';
        this.thirdColor = '#C0E3DF';
        this.fourthColor = '#2D99DA';

        this.gr = new GradientReader([{ stop: 0.20, color: this.firstColor },
                                  { stop: 0.40, color: this.secondColor },
                                  { stop: 0.60, color: this.thirdColor },
                                  { stop: 0.80, color: this.fourthColor }]);

        styles.colorSlider.width = this.colorRadius * 2;
        styles.colorSlider.height = this.colorRadius * 2;
        styles.colorSlider.borderRadius = this.colorRadius;

        styles.intensitySlider.width = this.intensityRadius * 2;
        styles.intensitySlider.height = this.intensityRadius * 2;
        styles.intensitySlider.borderRadius = this.intensityRadius;

        this.state = this.initState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initState(nextProps));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    initState(props) {
        const color = this.gr.getColor(props.color * 100);
        return {
            secondColor: `rgb(${color[0]},${color[1]},${color[2]})`,
            color: props.color,
            intensity: props.intensity,
        };
    }

    handleColorChange(value) {
        const color = this.gr.getColor(value * 100);

        this.setState({ secondColor: `rgb(${color[0]},${color[1]},${color[2]})` });
        this.props.setColor(value);
    }

    handleIntensityChange(value) {
        this.props.setIntensity(value);
    }

    render() {
        return (
            <div>
                <div style={[styles.container, styles.colorSlider]}>
                    <DayGradientIcon
                        style={styles.colorSlider}
                        radius={this.colorRadius}
                        borderWidth={this.buttonRadius * 2}
                        firstColor={this.firstColor}
                        secondColor={this.secondColor}
                        thirdColor={this.thirdColor}
                        fourthColor={this.fourthColor}
                    />
                    <SliderButton
                        value={this.state.color}
                        radius={this.colorRadius}
                        buttonRadius={this.buttonRadius - 2}
                        onChange={this.handleColorChange}
                    />

                    <CircleGradientIcon
                        style={styles.intensitySlider}
                        radius={this.intensityRadius}
                        borderWidth={this.buttonRadius * 2}
                        firstColor="black"
                        secondColor={this.state.secondColor}
                    />
                    <SliderButton
                        value={this.state.intensity}
                        radius={this.intensityRadius}
                        buttonRadius={this.buttonRadius - 2}
                        onChange={this.handleIntensityChange}
                        auxiliaryButtonsEnabled
                        auxiliaryRemoveButtonColor="black"
                        auxiliaryAddButtonColor={this.state.secondColor}
                        valueLabelEnabled
                    />
                </div>

                {this.props.children}
            </div>
        );
    }
}

/* eslint-disable */
DaySlider.propTypes = {
    children: React.PropTypes.node,
    color: React.PropTypes.number.isRequired,
    intensity: React.PropTypes.number.isRequired,
    lampId: React.PropTypes.string.isRequired,
    setColor: React.PropTypes.func.isRequired,
    setIntensity: React.PropTypes.func.isRequired,
};

export default Radium(DaySlider);
