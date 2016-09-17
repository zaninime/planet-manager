import { connect } from 'react-redux';
import Misc from 'views/Misc/Misc';
import { isFanConfigAvailable, isTemperatureConfigAvailable } from 'reducers';

const mapStateToProps = (state, { lampId }) => ({
  fanConfigAvailable: isFanConfigAvailable(state, lampId),
  temperatureConfigAvailable: isTemperatureConfigAvailable(state, lampId)
});

export default connect(mapStateToProps)(Misc);
