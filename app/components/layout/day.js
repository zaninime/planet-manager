import React from 'react';
import Section from 'app/components/layout/Section';
import DaySlider from 'app/components/connected/DaySlider';
import Timings from 'app/components/connected/Timings';
import TestButton from 'app/components/connected/TestButton';

const style = {
    testButton: {
        marginTop: '20px',
        marginBottom: '20px',
    },
};

const DayPage = ({ params }) => (
    <div>
        <Section title="Day">
            <DaySlider lampId={params.lampId}>
                <TestButton
                    primary
                    label="Test"
                    lampId={params.lampId}
                    style={style.testButton}
                />
            </DaySlider>
        </Section>
        <Section title="Timings">
            <Timings lampId={params.lampId} />
        </Section>
    </div>
);

DayPage.propTypes = {
    params: React.PropTypes.object.isRequired,
};

export default DayPage;
