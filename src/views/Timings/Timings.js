import React, { Component } from 'react';
import Timer from 'components/Timer/Timer';

class Timings extends Component {
  constructor(props) {
    super(props);
    this.handleSunriseChange = this.handleSunriseChange.bind(this);
    this.handleSunsetChange = this.handleSunsetChange.bind(this);

    // 1s = 1000ms, 1m -> 60s -> 60000ms
    const sunriseTime = new Date(this.props.sunriseTime * 60000);
    sunriseTime.setTime(sunriseTime.getTime() + sunriseTime.getTimezoneOffset() * 60000);

    const sunsetTime = new Date(this.props.sunsetTime * 60000);
    sunsetTime.setTime(sunsetTime.getTime() + sunsetTime.getTimezoneOffset() * 60000);

    this.state = {
      sunriseValue: sunriseTime,
      sunsetValue: sunsetTime,
      sunsetErrorText: ''
    };
  }

  handleSunriseChange(e, value) {
    this.setState({ sunriseValue: value });
    this.checkValues(value, this.state.sunsetValue);
    this.props.setSunriseTime(value.getHours() * 60 + value.getMinutes());
  }

  handleSunsetChange(e, value) {
    this.setState({ sunsetValue: value });
    this.checkValues(this.state.sunriseValue, value);
    this.props.setSunsetTime(value.getHours() * 60 + value.getMinutes());
  }

  checkValues(sunriseValue, sunsetValue) {
    if (sunsetValue !== null && sunriseValue !== null) {
      const sunriseMin = sunriseValue.getHours() * 60 + sunriseValue.getMinutes();
      const sunsetMin = sunsetValue.getHours() * 60 + sunsetValue.getMinutes();

      let errorText = '';

      if (sunsetMin - sunriseMin < 180)
        errorText = 'Sunrise and sunset must be at least 3 hours apart';

      this.setState({ sunsetErrorText: errorText });
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
          errorText={this.state.sunsetErrorText} />
      </div>
    );
  }
}

Timings.propTypes = {
  sunriseTime: React.PropTypes.number.isRequired,
  sunsetTime: React.PropTypes.number.isRequired,
  setSunriseTime: React.PropTypes.func.isRequired,
  setSunsetTime: React.PropTypes.func.isRequired
};

export default Timings;
