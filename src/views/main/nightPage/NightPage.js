import React from 'react';
import CustomSlider from 'components/common/CustomSlider/CustomSlider';
import NightColors from 'components/night/NightColors/NightColors';
import Section from 'views/main/common/Section/Section';

const NightPage = () => {
  return (
      <Section title="Night">
        <NightColors />
        <CustomSlider
          title="Color Intensity"
          step={1}
          min={0}
          max={20}
          interval={5}
          unit='%' />
      </Section>
    );
};

export default NightPage;
