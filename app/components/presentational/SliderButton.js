import React, { Component } from 'react';
import Radium from 'radium';
import Hammer from 'react-hammerjs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
    slider: {
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0',
        margin: 'auto',
    },
    sliderButton: {
        boxSizing: 'border-box',
        cursor: 'pointer',
        borderStyle: 'solid',
        borderWidth: '4px',
        borderColor: 'white',
        position: 'relative',
        left: '0px',
        top: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    addButton: {
        position: 'absolute',
        bottom: '10px',
        right: '75px',
    },
    removeButton: {
        position: 'absolute',
        bottom: '10px',
        left: '75px',
    },
    textContainer: {
        display: 'table',
        width: '100%',
        zIndex: -1,
        margin: 'auto',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    intensityText: {
        display: 'table-cell',
        verticalAlign: 'middle',
        fontSize: '38px',
    },
};


class SliderButton extends Component {
    constructor(props) {
        super(props);

        this.handleTouchEvent = this.handleTouchEvent.bind(this);
        this.handleRemoveTouchTap = this.handleRemoveTouchTap.bind(this);
        this.handleAddTouchTap = this.handleAddTouchTap.bind(this);

        this.updateFields(props);
        this.panStartedInside = false;

        this.state = {
            value: undefined,
            sliderStyle: this.createSliderStyle(),
            sliderButtonStyle: this.createSliderButtonStyle(),
            auxiliaryAddButtonColor: props.auxiliaryAddButtonColor,
            auxiliaryRemoveButtonColor: props.auxiliaryRemoveButtonColor,
        };
    }

    componentWillMount() {
        this.setValue(this.props.value, false);
    }

    componentDidMount() {
        this.bb = this.buttonContainer.getBoundingClientRect();
    }

    componentWillReceiveProps(nextProps) {
        this.updateFields(nextProps);

        if (nextProps.value !== this.props.value) {
            this.setValue(nextProps.value, false);
        }

        let { sliderStyle, sliderButtonStyle } = this.state;
        sliderStyle = this.createSliderStyle(sliderStyle);
        sliderButtonStyle = this.createSliderButtonStyle(sliderButtonStyle);

        this.setState({
            sliderStyle,
            sliderButtonStyle,
            auxiliaryAddButtonColor: nextProps.auxiliaryAddButtonColor,
            auxiliaryRemoveButtonColor: nextProps.auxiliaryRemoveButtonColor,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    setValue(value, triggerOnChange = true) {
        let adjustedValue = value;
        if (value >= 1.00) {
            adjustedValue = 1.00;
        } else if (value <= 0.00) {
            adjustedValue = 0.00;
        }

        let v = (adjustedValue * 270) + 225;
        if (adjustedValue <= 0.5) {
            v = (adjustedValue * 270) - 135;
        }

        this.setDegrees(v, triggerOnChange);
    }

    setDegrees(deg, triggerOnChange = true) {
        let adjustedDeg = deg;
        if (adjustedDeg < 225 && adjustedDeg > 225 - this.buttonRadius) {
            adjustedDeg = 225;
        } else if (adjustedDeg > 135 && adjustedDeg <= 180 - this.buttonRadius) {
            adjustedDeg = 135;
        }

        if (adjustedDeg >= 225 || adjustedDeg <= 135) {
            const X = Math.round((this.radius - this.buttonRadius) * Math.sin((adjustedDeg * Math.PI) / 180));
            const Y = Math.round((this.radius - this.buttonRadius) * -Math.cos((adjustedDeg * Math.PI) / 180));

            const { sliderButtonStyle } = this.state;
            sliderButtonStyle.left = X + (this.radius - this.buttonRadius);
            sliderButtonStyle.top = Y + (this.radius - this.buttonRadius);
            sliderButtonStyle.transform = `rotate(${adjustedDeg}deg)`;

            let value = adjustedDeg - 225;
            if (adjustedDeg <= 135) {
                value = 135 + adjustedDeg;
            }

            value = Math.round((value / 270) * 1e2) / 1e2;

            if (value !== this.state.value) {
                this.setState({ value, sliderButtonStyle });

                if (triggerOnChange) {
                    this.props.onChange(value * 1);
                }
            }
        }
    }

    updateFields(props) {
        this.radius = props.radius;
        this.diameter = props.radius * 2;
        this.buttonRadius = props.buttonRadius;
        this.buttonDiameter = props.buttonRadius * 2;
    }

    createSliderStyle(sliderStyle = { }) {
        const style = sliderStyle;
        style.width = this.diameter;
        style.height = this.diameter;
        style.borderRadius = this.radius;

        return sliderStyle;
    }

    createSliderButtonStyle(sliderButtonStyle = { }) {
        const style = sliderButtonStyle;
        style.width = this.buttonDiameter;
        style.height = this.buttonDiameter;
        style.borderRadius = this.buttonRadius;

        return style;
    }

    handleTouchEvent(e, type) {
        const position = {
            x: Math.max(0, e.center.x - this.bb.left),
            y: Math.max(0, e.center.y - this.bb.top),
        };

        // the div border radius creates an outer border and prevents clicks
        // outside the circle, but we need to prevent clicks inside the inner
        // circle also, so the button can just be slided through a rounded strip
        // of width this.buttonDiameter

        // check if the point isn't in the inner circle with the following equation
        // (positionX - centerX)^2 + (positionY - centerY)^2 >= radiusInnerCircle^2
        // the center equals to the radius because the top left corner is at (0,0)
        const isInsideInnerCircle = ((position.x - this.radius) ** 2) + ((position.y - this.radius) ** 2)
                                    >= ((this.radius - this.buttonDiameter) ** 2);

        if (type === 'panStart' && isInsideInnerCircle) {
            this.panStartedInside = true;
        } else if (type !== 'pan') {
            this.panStartedInside = false;
        }

        // a tap can't be perfomed outside the inner and outer boundaries
        // while a pan can start on the inside only and continue anywhere else
        // so this behaves like a material slider
        if ((type === 'pan' && this.panStartedInside) || (isInsideInnerCircle && type === 'tap')) {
            e.preventDefault();

            const atan = Math.atan2(position.x - this.radius, position.y - this.radius);
            const deg = Math.round((-atan / (Math.PI / 180)) + 180);
            this.setDegrees(deg);
        }
    }

    handleRemoveTouchTap() {
        this.setValue(this.state.value - 0.01);
    }

    handleAddTouchTap() {
        this.setValue(this.state.value + 0.01);
    }

    render() {
        const { auxiliaryButtonsEnabled, valueLabelEnabled } = this.props;

        let auxiliaryButtons;
        if (auxiliaryButtonsEnabled) {
            auxiliaryButtons = (
                <div style={styles.buttonsContainer}>
                    <FloatingActionButton
                        mini
                        zDepth={1}
                        onTouchTap={this.handleRemoveTouchTap}
                        backgroundColor={this.state.auxiliaryRemoveButtonColor}
                        style={styles.removeButton}
                    >
                        <RemoveIcon />
                    </FloatingActionButton>
                    <FloatingActionButton
                        mini
                        zDepth={1}
                        onTouchTap={this.handleAddTouchTap}
                        backgroundColor={this.state.auxiliaryAddButtonColor}
                        style={styles.addButton}
                    >
                        <AddIcon />
                    </FloatingActionButton>
                </div>
            );
        }

        let valueLabel;
        if (valueLabelEnabled) {
            valueLabel = (
                <div style={styles.textContainer}>
                    <p style={styles.intensityText}>
                        {`${Math.round(this.state.value * 100)}%`}
                    </p>
                </div>
            );
        }

        /* eslint-disable */
        return (
            <div>
                <Hammer
                    onPan={e => this.handleTouchEvent(e, 'pan')}
                    onPanStart={e => this.handleTouchEvent(e, 'panStart')}
                    onPanEnd={e => this.handleTouchEvent(e, 'panEnd')}
                    onTap={e => this.handleTouchEvent(e, 'tap')}
                >
                    <div
                        ref={ref => this.buttonContainer = ref}
                        style={[styles.slider, this.state.sliderStyle]}
                    >
                        <div style={[styles.sliderButton, this.state.sliderButtonStyle]} />
                    </div>
                </Hammer>

                {auxiliaryButtons}
                {valueLabel}
            </div>
        );
    }
}

/* eslint-disable */
SliderButton.propTypes = {
    radius: React.PropTypes.number.isRequired,
    buttonRadius: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
    auxiliaryButtonsEnabled: React.PropTypes.bool,
    valueLabelEnabled: React.PropTypes.bool,
    auxiliaryAddButtonColor: React.PropTypes.string,
    auxiliaryRemoveButtonColor: React.PropTypes.string,
};

export default Radium(SliderButton);
