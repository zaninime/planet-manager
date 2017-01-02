import React, { Component } from 'react';
import Radium from 'radium';
import Hammer from 'react-hammerjs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import shallowCompare from 'react-addons-shallow-compare';
import clamp from 'app/utils/clamp';

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
        backgroundColor: 'rgba(230, 230, 230, 0.8)',
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
    static checkMinMaxPropType(props, name, component) {
        if (props[name] < 0) {
            throw new Error(`Invalid prop ${name} supplied to ${component}. Must be greater than 0.`);
        } else if (props[name] > 1) {
            throw new Error(`Invalid prop ${name} supplied to ${component}. Must be smaller than 1.`);
        } else if (props.minValue >= props.maxValue || (props.maxValue * 10) - (props.minValue * 10) < 1) {
            const error = `Invalid props minValue and maxValue supplied to ${component}. ` +
                          'maxValue (default 1) must be greater than minValue (default 0), at least by a tenth.';
            throw new Error(error);
        }
    }

    constructor(props) {
        super(props);

        this.handleTouchEvent = this.handleTouchEvent.bind(this);
        this.handleRemoveTouchTap = this.handleRemoveTouchTap.bind(this);
        this.handleAddTouchTap = this.handleAddTouchTap.bind(this);

        this.updateFields(props);
        this.panStartedInside = false;
        this.previousDeg = null;

        this.state = {
            value: null,
            percentage: null,
            sliderStyle: this.createSliderStyle(),
            sliderButtonStyle: this.createSliderButtonStyle(),
            addButtonColor: props.addButtonColor,
            removeButtonColor: props.removeButtonColor,
        };
    }

    componentWillMount() {
        this.setValue(this.props.value);
    }

    componentWillReceiveProps(nextProps) {
        this.updateFields(nextProps);

        if (nextProps.value !== this.props.value) {
            this.setValue(nextProps.value);
        }

        let { sliderStyle, sliderButtonStyle } = this.state;
        sliderStyle = this.createSliderStyle(sliderStyle);
        sliderButtonStyle = this.createSliderButtonStyle(sliderButtonStyle);

        this.setState({
            sliderStyle,
            sliderButtonStyle,
            addButtonColor: nextProps.addButtonColor,
            removeButtonColor: nextProps.removeButtonColor,
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    setValue(value, touchType = 'none') {
        const sliderProportion = this.getSliderProportion(value);

        if (value <= 0.5) {
            this.setDegrees((sliderProportion * 270) - 135, touchType);
            return;
        }
        this.setDegrees((sliderProportion * 270) + 225, touchType);
    }

    setDegrees(deg, touchType) {
        let adjustedDeg = deg;

        const firstExtr = 225 - this.buttonRadius;
        const secondExtr = 135 + this.buttonRadius;
        if (deg < firstExtr && deg > secondExtr) {
            if (touchType.startsWith('pan') && this.previousDeg !== null) {
                if (this.previousDeg >= firstExtr && deg < firstExtr) adjustedDeg = 225;
                else if (this.previousDeg <= secondExtr && deg > secondExtr) adjustedDeg = 135;
            } else return;
        }

        if (touchType !== 'none') this.previousDeg = adjustedDeg;

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

            // Do not round!
            // Allow the user to select a float precision value
            value /= 270;
            const { onChange, onRelease } = this.props;

            const valueProportion = this.getValueProportion(value);
            const percentage = Math.round(valueProportion * 100);

            if (value !== this.state.value) {
                this.setState({ value, sliderButtonStyle, percentage });

                if (touchType !== 'none') {
                    if (onChange) {
                        onChange(valueProportion);
                    }

                    if (onRelease && (['tap', 'button', 'panEnd'].indexOf(touchType) > -1)) {
                        onRelease(valueProportion);
                    }
                }
            } else if (onRelease && (touchType === 'panEnd')) {
                // panEnd isn't detected since the value equals
                // to the last one computed on the last pan
                onRelease(valueProportion);
            }
        }
    }

    getValueProportion(value) {
        const { maxValue, minValue } = this.props;
        return (clamp(value, 0.0, 1.0) * (maxValue - minValue)) + minValue;
    }

    getSliderProportion(value) {
        const { maxValue, minValue } = this.props;
        return (clamp(value, minValue, maxValue) - minValue) / (maxValue - minValue);
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
        e.preventDefault();

        // obtain the bounding box every time for a possible window resizing
        const bb = this.buttonContainer.getBoundingClientRect();
        const position = {
            x: Math.max(0, e.center.x - bb.left),
            y: Math.max(0, e.center.y - bb.top),
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
        } else if (!type.startsWith('pan')) {
            // set it false for every 'non-pan' touch
            this.panStartedInside = false;
        }

        // a tap can't be perfomed outside the inner and outer boundaries
        // while a pan can start on the inside only and continue anywhere else
        // so this behaves like a material slider
        if ((type.startsWith('pan') && this.panStartedInside) || (isInsideInnerCircle && type === 'tap')) {
            const atan = Math.atan2(position.x - this.radius, position.y - this.radius);
            const deg = Math.round((-atan / (Math.PI / 180)) + 180);

            this.setDegrees(deg, type);
        }
    }

    handleRemoveTouchTap() {
        this.setValue(this.getValueProportion(this.state.value) - 0.01, 'button');
    }

    handleAddTouchTap() {
        this.setValue(this.getValueProportion(this.state.value) + 0.01, 'button');
    }

    render() {
        const {
            buttonsEnabled,
            addButtonIconColor,
            removeButtonIconColor,
            valueLabelEnabled,
        } = this.props;

        let buttons;
        if (buttonsEnabled) {
            // color property, on icons as fab children, does not work properly
            // fill color style is needed
            const addIconStyle = { fill: addButtonIconColor };
            const removeIconStyle = { fill: removeButtonIconColor };

            buttons = (
                <div style={styles.buttonsContainer}>
                    <FloatingActionButton
                        mini
                        zDepth={1}
                        onTouchTap={this.handleRemoveTouchTap}
                        backgroundColor={this.state.removeButtonColor}
                        style={styles.removeButton}
                    >
                        <RemoveIcon style={removeIconStyle} />
                    </FloatingActionButton>
                    <FloatingActionButton
                        mini
                        zDepth={1}
                        onTouchTap={this.handleAddTouchTap}
                        backgroundColor={this.state.addButtonColor}
                        style={styles.addButton}
                    >
                        <AddIcon style={addIconStyle} />
                    </FloatingActionButton>
                </div>
            );
        }

        let valueLabel;
        if (valueLabelEnabled) {
            valueLabel = (
                <div style={styles.textContainer}>
                    <p style={styles.intensityText}>
                        {`${this.state.percentage}%`}
                    </p>
                </div>
            );
        }

        return (
            <div>
                <Hammer
                    onPan={e => this.handleTouchEvent(e, 'pan')}
                    onPanStart={e => this.handleTouchEvent(e, 'panStart')}
                    onPanEnd={e => this.handleTouchEvent(e, 'panEnd')}
                    onTap={e => this.handleTouchEvent(e, 'tap')}
                >
                    {/* eslint-disable */}
                    <div ref={ref => this.buttonContainer = ref} style={[styles.slider, this.state.sliderStyle]}>
                    {/* eslint-enable */}
                        <div style={[styles.sliderButton, this.state.sliderButtonStyle]} />
                    </div>
                </Hammer>

                {buttons}
                {valueLabel}
            </div>
        );
    }
}

SliderButton.propTypes = {
    radius: React.PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    buttonRadius: React.PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    value: React.PropTypes.number.isRequired,
    minValue: SliderButton.checkMinMaxPropType,
    maxValue: SliderButton.checkMinMaxPropType,
    onChange: React.PropTypes.func,
    onRelease: React.PropTypes.func,
    buttonsEnabled: React.PropTypes.bool,
    valueLabelEnabled: React.PropTypes.bool,
    addButtonColor: React.PropTypes.string,
    addButtonIconColor: React.PropTypes.string,
    removeButtonColor: React.PropTypes.string,
    removeButtonIconColor: React.PropTypes.string,
};

SliderButton.defaultProps = {
    minValue: 0.0,
    maxValue: 1.0,
};

export default Radium(SliderButton);
