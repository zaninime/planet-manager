import React from 'react';
import Section from 'components/views/Section';
import DaySlider from 'components/connected/DaySlider';
import Timings from 'components/connected/Timings';

const DayPage = ({ params }) => {
  return (
    <div>
      <Section title="Day">
        <DaySlider lampId={params.lampId}/>
      </Section>
      <Section title="Timings">
        <Timings lampId={params.lampId}/>
      </Section>
    </div>
  );
};

DayPage.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default DayPage;
