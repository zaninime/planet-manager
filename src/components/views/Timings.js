import React, { Component } from 'react';
import Timer from 'components/presentational/Timer';
import shallowCompare from 'react-addons-shallow-compare';

class Timings extends Component {
  constructor(props) {
    super(props);
    this.handleSunriseChange = this.handleSunriseChange.bind(this);
    this.handleSunsetChange = this.handleSunsetChange.bind(this);

    this.state = this.initState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (shallowCompare(this, nextProps, this.state))
      this.setState(this.initState(nextProps));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  initState(props) {
    // 1s = 1000ms, 1m -> 60s -> 60000ms
    const sunriseTime = new Date(props.sunriseTime * 60000);
    sunriseTime.setTime(sunriseTime.getTime() + sunriseTime.getTimezoneOffset() * 60000);

    const sunsetTime = new Date(props.sunsetTime * 60000);
    sunsetTime.setTime(sunsetTime.getTime() + sunsetTime.getTimezoneOffset() * 60000);

    return {
      sunriseValue: sunriseTime,
      sunsetValue: sunsetTime,
      sunsetFieldErrorText: ''
    };
  }

  handleSunriseChange(e, value) {
    const sunsetFieldErrorText = this.checkValues(value, this.state.sunsetValue);
    this.setState({ sunriseValue: value, sunsetFieldErrorText });

    if (sunsetFieldErrorText === "")
      this.props.setSunriseTime(value.getHours() * 60 + value.getMinutes());
  }

  handleSunsetChange(e, value) {
    const sunsetFieldErrorText = this.checkValues(this.state.sunriseValue, value);
    this.setState({ sunsetValue: value, sunsetFieldErrorText });

    if (sunsetFieldErrorText === "")
      this.props.setSunsetTime(value.getHours() * 60 + value.getMinutes());
  }

  checkValues(sunriseValue, sunsetValue) {
    if (sunsetValue !== null && sunriseValue !== null) {
      const sunriseMin = sunriseValue.getHours() * 60 + sunriseValue.getMinutes();
      const sunsetMin = sunsetValue.getHours() * 60 + sunsetValue.getMinutes();

      let errorText = '';

      if (sunsetMin - sunriseMin < 60) {
        errorText = 'Sunrise and sunset must be at least 1 hour apart';
        this.props.setFieldError(true);
      }
      else
        this.props.setFieldError(false);

      return errorText;
    }
  }

  render() {
    return (
      <div>
        <Timer
          type='sunrise'
          value={this.state.sunriseValue}
          onChange={this.handleSunriseChange} />
        <Timer
          type='sunset'
          value={this.state.sunsetValue}
          onChange={this.handleSunsetChange}
          errorText={this.state.sunsetFieldErrorText} />
      </div>
    );
  }
}

Timings.propTypes = {
  sunriseTime: React.PropTypes.number.isRequired,
  sunsetTime: React.PropTypes.number.isRequired,
  setSunriseTime: React.PropTypes.func.isRequired,
  setSunsetTime: React.PropTypes.func.isRequired,
  setFieldError: React.PropTypes.func.isRequired
};

export default Timings;
