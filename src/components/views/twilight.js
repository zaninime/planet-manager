import React from 'react';
import Section from 'components/views/Section';
import TwilightSlider from 'components/connected/TwilightSlider';

const TwilightPage = ({ params }) => {
  return (
    <Section title="Twilight">
      <TwilightSlider lampId={params.lampId}/>
    </Section>
  );
};

TwilightPage.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default TwilightPage;
