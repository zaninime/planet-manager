import React from 'react';
import Section from 'views/Section/Section';
import TwilightSlider from 'containers/TwilightSlider/TwilightSlider';

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
