import React from 'react';
import Radium from 'radium';
import FanMaxSpeedSlider from 'app/components/connected/FanMaxSpeedSlider';
import FanStartTemperatureSlider from 'app/components/connected/FanStartTemperatureSlider';
import Section from 'app/components/layout/Section';

const styles = {
    slider: {
        marginBottom: '20px',
    },
};

const Misc = ({ fanConfigAvailable, temperatureConfigAvailable, lampId }) => {
    let fanMaxSpeedSlider;
    if (fanConfigAvailable) {
        fanMaxSpeedSlider = (
            <FanMaxSpeedSlider
                lampId={lampId}
                style={styles.slider}
                title="Fan Max Speed"
                step={1}
                min={50}
                max={100}
                unit="%"
            />
        );
    }

    let fanStartTemperatureSlider;
    if (temperatureConfigAvailable) {
        fanStartTemperatureSlider = (
            <FanStartTemperatureSlider
                lampId={lampId}
                style={styles.slider}
                title="Fan Start Temperature"
                step={1}
                min={15}
                max={40}
                interval={5}
                unit="°C"
            />
        );
    }

    let section = null;
    if (fanConfigAvailable || temperatureConfigAvailable) {
        section = (
            <Section title="Misc">
                {fanMaxSpeedSlider}
                {fanStartTemperatureSlider}
            </Section>
        );
    }

    return section;
};

Misc.propTypes = {
    fanConfigAvailable: React.PropTypes.bool.isRequired,
    temperatureConfigAvailable: React.PropTypes.bool.isRequired,
    lampId: React.PropTypes.string.isRequired,
};

export default Radium(Misc);
