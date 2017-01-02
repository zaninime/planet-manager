import React from 'react';
import Section from 'app/components/layout/Section';
import TwilightSlider from 'app/components/connected/TwilightSlider';

const TwilightPage = ({ params }) => (
    <Section title="Twilight">
        <TwilightSlider lampId={params.lampId} />
    </Section>
);

TwilightPage.propTypes = {
    params: React.PropTypes.object.isRequired,
};

export default TwilightPage;
