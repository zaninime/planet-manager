import React, { Component } from 'react';
import Timer from 'components/timings/Timer/Timer';

class Timers extends Component {
  constructor(props) {
    super(props);
    this.handleSunriseChange = this.handleSunriseChange.bind(this);
    this.handleSunsetChange = this.handleSunsetChange.bind(this);

    this.state = { sunsetValue: null, sunsetErrorText: '', sunriseValue: null };
  }

  handleSunriseChange(e, value) {
    this.setState({ sunriseValue: value });
    this.checkValues(value, this.state.sunsetValue);
  }

  handleSunsetChange(e, value) {
    this.setState({ sunsetValue: value });
    this.checkValues(this.state.sunriseValue, value);
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

export default Timers;
