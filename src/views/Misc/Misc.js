import React from 'react';
import Radium from 'radium';
import FanMaxSpeedSlider from 'containers/FanMaxSpeedSlider/FanMaxSpeedSlider';
import FanStartTemperatureSlider from 'containers/FanStartTemperatureSlider/FanStartTemperatureSlider';
import SyncClockButton from 'components/SyncClockButton/SyncClockButton';
import Section from 'views/Section/Section';

const styles = {
  button: {
    marginBottom: '20px'
  },
  slider: {
    marginBottom: '40px'
  }
};

const Misc = ({ lampId }) => {
  return (
    <Section title="Misc">
      <FanMaxSpeedSlider
        lampId={lampId}
        style={styles.slider}
        title="Fan Max Speed"
        step={1}
        min={50}
        max={100}
        unit='%' />
      <FanStartTemperatureSlider
        lampId={lampId}
        style={styles.slider}
        title="Fan Start Temperature"
        step={1}
        min={15}
        max={40}
        interval={5}
        unit='°C' />
      <SyncClockButton style={styles.button}/>
    </Section>
  );
};

Misc.propTypes = {
  lampId: React.PropTypes.string.isRequired
};

export default Radium(Misc);
