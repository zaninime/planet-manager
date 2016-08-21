import React, { Component } from 'react';
import Section from 'views/main/common/Section/Section';
import DaySlider from 'components/day/DaySlider/DaySlider';
import Timers from 'views/main/timings/Timings';

class DayPage extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <Section title="Day">
          <DaySlider />
        </Section>
        <Section title="Timings">
          <Timers />
        </Section>
      </div>
    );
  }
}

export default DayPage;
