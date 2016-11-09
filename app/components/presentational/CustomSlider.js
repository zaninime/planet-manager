import React from 'react';
import Radium from 'radium';
import Slider from 'material-ui/Slider';
import SliderPins from './SliderPins';

const styles = {
    container: {
        height: '100%',
    },
    title: {
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    slider: {
        width: '70%',
        margin: '0 auto 0',
    },
    sliderPins: {
        margin: '-55px auto 30px auto',
        width: '70%',
    },
};

const CustomSlider = ({ style, title, value, onChange, min = 0, max = 100, interval = 10, unit = '' }) =>
(
    <div style={[styles.container, style]}>
        <p style={styles.title}>{title}</p>
        <Slider style={styles.slider} step={1} min={min} max={max} value={value} onChange={onChange} />
        <SliderPins style={styles.sliderPins} min={min} max={max} interval={interval} unit={unit} />
    </div>
);

CustomSlider.propTypes = {
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    interval: React.PropTypes.number,
    unit: React.PropTypes.string,
};

export default Radium(CustomSlider);
