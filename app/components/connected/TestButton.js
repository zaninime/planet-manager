import RaisedButton from 'material-ui/RaisedButton';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { getDayColor, getDayColorIntensity } from 'app/redux/modules';
import Radium from 'radium';
import emitDemo from 'app/protocol/photon/demo';

const mapStateToProps = (state, { lampId }) => ({
    color: getDayColor(state, lampId),
    intensity: getDayColorIntensity(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    demoMode: (colors) => dispatch({ type: 'lamps/DEMO_MODE', payload: { lampId, ...colors } }),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    mapProps(({ color, intensity, demoMode, ...props }) => {
        const colors = emitDemo(color, intensity);
        return {
            ...props,
            lampId: undefined,
            onClick: () => demoMode(colors),
        };
    }),
    Radium,
)(RaisedButton);
