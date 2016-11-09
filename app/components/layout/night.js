import React from 'react';
import NightColors from 'app/components/connected/NightColors';
import NightColorIntensitySlider from 'app/components/connected/NightColorIntensitySlider';
import Section from 'app/components/layout/Section';

const NightPage = ({ params }) =>
(
    <Section title="Night">
        <NightColors lampId={params.lampId} />
        <NightColorIntensitySlider
            lampId={params.lampId}
            title="Color Intensity"
            step={1}
            min={0}
            max={20}
            interval={5}
            unit="%"
        />
    </Section>
);

NightPage.propTypes = {
    params: React.PropTypes.object.isRequired,
};

export default NightPage;
