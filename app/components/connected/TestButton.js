import RaisedButton from 'material-ui/RaisedButton';
import filterProps from 'app/components/enhancer/filterProps';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import Radium from 'radium';

const mapDispatchToProps = (dispatch, { lampId }) => ({
    demoMode: () => dispatch({ type: 'lamps/DEMO_MODE', payload: { lampId } }),
});

export default compose(
    connect(null, mapDispatchToProps),
    mapProps(({ demoMode, ...props }) => ({
        ...props,
        onClick: () => demoMode(),
    })),
    filterProps('lampId'),
    Radium,
)(RaisedButton);
