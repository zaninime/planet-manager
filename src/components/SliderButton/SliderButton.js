import React, { Component } from 'react';
import Radium from 'radium';
import Hammer from 'react-hammerjs';

class SliderButton extends Component {
  constructor(props) {
    super(props);

    this.styles = {
      slider: { },
      sliderButtonContainer: {
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
      }
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.value = this.props.value === undefined ? 0 : this.props.value;
    this.radius = this.props.radius;
    this.diameter = this.props.radius * 2;
    this.buttonRadius = this.props.buttonRadius;
    this.buttonDiameter = this.props.buttonRadius * 2;
    this.bb = null;

    this.styles.slider.width = this.diameter;
    this.styles.slider.height = this.diameter;
    this.styles.slider.borderRadius = this.radius;

    this.styles.sliderButton.width = this.buttonDiameter;
    this.styles.sliderButton.height = this.buttonDiameter;
    this.styles.sliderButton.borderRadius = this.buttonRadius;
  }

  componentWillMount() {
    this.setValue(this.value);
  }

  handleMouseMove(e) {
    e.preventDefault();

    if (this.bb === null && e.target.id === "sliderButtonContainer")
      this.bb = e.target.getBoundingClientRect();

    if (this.bb !== null) {
      const position = {
        x: Math.max(0, e.center.x - this.bb.left),
        y: Math.max(0, e.center.y - this.bb.top),
      };

      const atan = Math.atan2(position.x - this.radius, position.y - this.radius);
      const deg = Math.trunc( - atan / (Math.PI / 180) + 180);

      this.setDegrees(deg);
    }
  }

  setValue(value) {
    let v = value * 270 + 225;
    if (value <= 0.5)
      v = value * 270 - 135;

    this.setDegrees(v);
  }

  setDegrees(deg) {
    if (deg < 225 && deg > 225 - this.buttonRadius)
      deg = 225;
    else if (deg > 135 && deg <= 180 - this.buttonRadius)
      deg = 135;

    if (deg >= 225 || deg <= 135) {
      const X = Math.round((this.radius - this.buttonRadius) * Math.sin(deg * Math.PI / 180));
      const Y = Math.round((this.radius - this.buttonRadius) * -Math.cos(deg * Math.PI / 180));

      const sliderButtonPosition = { };
      sliderButtonPosition.left = X + (this.radius - this.buttonRadius);
      sliderButtonPosition.top = Y + (this.radius - this.buttonRadius);
      sliderButtonPosition.transform = 'rotate(' + deg + 'deg)';

      let value = deg - 225;
      if (deg <= 135)
        value = 135 + deg;

      value = (value / 270).toFixed(2);

      if (value != this.state.value) {
        this.setState({ 'value': value, 'sliderButtonPosition': sliderButtonPosition });

        if (this.props.onChange !== undefined)
          this.props.onChange(value * 1);
      }
    }
  }

  render() {
    return (
      <Hammer onPan={this.handleMouseMove} onTap={this.handleMouseMove}>
        <div id="sliderButtonContainer" style={[this.styles.sliderButtonContainer, this.styles.slider]}>
          <div style={[this.styles.sliderButton, this.state.sliderButtonPosition]}></div>
        </div>
      </Hammer>
    );
  }
}

SliderButton.propTypes = {
  radius: React.PropTypes.number.isRequired,
  buttonRadius: React.PropTypes.number.isRequired,
  value: React.PropTypes.number,
  onChange: React.PropTypes.func
};

export default Radium(SliderButton);
