import React from 'react';
import NightColors from 'containers/NightColors/NightColors';
import NightColorIntensitySlider from 'containers/NightColorIntensitySlider/NightColorIntensitySlider';
import Section from 'views/Section/Section';

const NightPage = ({ params }) => {
  return (
      <Section title="Night">
        <NightColors lampId={params.lampId} />
        <NightColorIntensitySlider
          lampId={params.lampId}
          title="Color Intensity"
          step={1}
          min={0}
          max={20}
          interval={5}
          unit='%'
           />
      </Section>
    );
};

NightPage.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default NightPage;
