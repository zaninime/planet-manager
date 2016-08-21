import React from 'react';
import Radium from 'radium';
import CustomSlider from 'components/common/CustomSlider/CustomSlider';
import SyncClockButton from 'components/advanced/misc/SyncClockButton/SyncClockButton';
import Section from 'views/main/common/Section/Section';

const styles = {
  button: {
    marginBottom: '20px'
  },
  slider: {
    marginBottom: '40px'
  }
};

const Misc = () => {
  return (
    <Section title="Misc">
      <CustomSlider
        style={styles.slider}
        title="Fan Max Speed"
        step={1}
        min={50}
        max={100}
        unit='%' />
      <CustomSlider
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

export default Radium(Misc);
