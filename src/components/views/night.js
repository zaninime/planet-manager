import React from 'react';
import NightColors from 'components/connected/NightColors';
import NightColorIntensitySlider from 'components/connected/NightColorIntensitySlider';
import Section from 'components/views/Section';

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
