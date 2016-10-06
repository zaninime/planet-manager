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
    margin: 'auto'
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
    right: '75px'
  },
  removeButton: {
    position: 'absolute',
    bottom: '10px',
    left: '75px'
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
    fontSize: '38px'
  }
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
      auxiliaryRemoveButtonColor: props.auxiliaryRemoveButtonColor
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

    if (nextProps.value !== this.props.value)
      this.setValue(nextProps.value, false);

    let { sliderStyle, sliderButtonStyle } = this.state;
    sliderStyle = this.createSliderStyle(sliderStyle);
    sliderButtonStyle = this.createSliderButtonStyle(sliderButtonStyle);

    this.setState({
      sliderStyle,
      sliderButtonStyle,
      auxiliaryAddButtonColor: nextProps.auxiliaryAddButtonColor,
      auxiliaryRemoveButtonColor: nextProps.auxiliaryRemoveButtonColor
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  updateFields(props) {
    this.radius = props.radius;
    this.diameter = props.radius * 2;
    this.buttonRadius = props.buttonRadius;
    this.buttonDiameter = props.buttonRadius * 2;
  }

  createSliderStyle(sliderStyle = { }) {
    sliderStyle.width = this.diameter;
    sliderStyle.height = this.diameter;
    sliderStyle.borderRadius = this.radius;

    return sliderStyle;
  }

  createSliderButtonStyle(sliderButtonStyle = { }) {
    sliderButtonStyle.width = this.buttonDiameter;
    sliderButtonStyle.height = this.buttonDiameter;
    sliderButtonStyle.borderRadius = this.buttonRadius;

    return sliderButtonStyle;
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
    const isInsideInnerCircle =
      Math.pow(position.x - this.radius, 2)
      + Math.pow(position.y - this.radius, 2)
      >= Math.pow(this.radius - this.buttonDiameter, 2);

    if (type === 'panStart' && isInsideInnerCircle)
      this.panStartedInside = true;
    else if (type != 'pan')
      this.panStartedInside = false;

    // a tap can't be perfomed outside the inner and outer boundaries
    // while a pan can start on the inside only and continue anywhere else
    // so this behaves like a material slider
    if ((type == 'pan' && this.panStartedInside) || (isInsideInnerCircle && type == 'tap')) {
      e.preventDefault();

      const atan = Math.atan2(position.x - this.radius, position.y - this.radius);
      const deg = Math.round(-atan / (Math.PI / 180) + 180);
      this.setDegrees(deg);
    }
  }

  setValue(value, triggerOnChange = true) {
    if (value >= 1.00)
      value = 1.00;
    else if (value <= 0.00)
      value = 0.00;

    let v = value * 270 + 225;
    if (value <= 0.5)
      v = value * 270 - 135;

    this.setDegrees(v, triggerOnChange);
  }

  setDegrees(deg, triggerOnChange = true) {
    if (deg < 225 && deg > 225 - this.buttonRadius)
      deg = 225;
    else if (deg > 135 && deg <= 180 - this.buttonRadius)
      deg = 135;

    if (deg >= 225 || deg <= 135) {
      const X = Math.round((this.radius - this.buttonRadius) * Math.sin(deg * Math.PI / 180));
      const Y = Math.round((this.radius - this.buttonRadius) * -Math.cos(deg * Math.PI / 180));

      const { sliderButtonStyle } = this.state;
      sliderButtonStyle.left = X + (this.radius - this.buttonRadius);
      sliderButtonStyle.top = Y + (this.radius - this.buttonRadius);
      sliderButtonStyle.transform = 'rotate(' + deg + 'deg)';

      let value = deg - 225;
      if (deg <= 135)
        value = 135 + deg;

      value = Math.round(value / 270 * 1e2) / 1e2;

      if (value !== this.state.value) {
        this.setState({ value, sliderButtonStyle });

        if (triggerOnChange)
          this.props.onChange(value * 1);
      }
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
            mini={true}
            zDepth={1}
            onTouchTap={this.handleRemoveTouchTap}
            backgroundColor={this.state.auxiliaryRemoveButtonColor}
            style={styles.removeButton}>
            <RemoveIcon />
          </FloatingActionButton>
          <FloatingActionButton
            mini={true}
            zDepth={1}
            onTouchTap={this.handleAddTouchTap}
            backgroundColor={this.state.auxiliaryAddButtonColor}
            style={styles.addButton}>
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
            {Math.round(this.state.value * 100) + "%"}
          </p>
        </div>
      );
    }

    return (
      <div>
        <Hammer
          onPan={(e) => this.handleTouchEvent(e, 'pan')}
          onPanStart={(e) => this.handleTouchEvent(e, 'panStart')}
          onPanEnd={(e) => this.handleTouchEvent(e, 'panEnd')}
          onTap={(e) => this.handleTouchEvent(e, 'tap')}>
          <div
            ref={(ref) => this.buttonContainer = ref}
            style={[styles.slider, this.state.sliderStyle]}>
            <div
              style={[styles.sliderButton, this.state.sliderButtonStyle]}>
            </div>
          </div>
        </Hammer>

        {auxiliaryButtons}
        {valueLabel}
      </div>
    );
  }
}

SliderButton.propTypes = {
  radius: React.PropTypes.number.isRequired,
  buttonRadius: React.PropTypes.number.isRequired,
  value: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  auxiliaryButtonsEnabled: React.PropTypes.bool,
  valueLabelEnabled: React.PropTypes.bool,
  auxiliaryAddButtonColor: React.PropTypes.string,
  auxiliaryRemoveButtonColor: React.PropTypes.string
};

export default Radium(SliderButton);