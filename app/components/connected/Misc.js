import { connect } from 'react-redux';
import Misc from 'app/components/layout/Misc';
import { isFanConfigAvailable, isTemperatureConfigAvailable } from 'app/redux/modules';

const mapStateToProps = (state, { lampId }) => ({
    fanConfigAvailable: isFanConfigAvailable(state, lampId),
    temperatureConfigAvailable: isTemperatureConfigAvailable(state, lampId),
});

export default connect(mapStateToProps)(Misc);
