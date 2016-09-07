import React from 'react';
import Section from 'views/Section/Section';
import DaySlider from 'containers/DaySlider/DaySlider';
import Timings from 'containers/Timings/Timings';

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
