import React, { Component } from 'react';
import Section from 'views/main/common/Section/Section';
import TwilightSlider from 'components/twilight/TwilightSlider/TwilightSlider';

class TwilightPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Section title="Twilight">
        <TwilightSlider/>
      </Section>
    );
  }
}

export default TwilightPage;
