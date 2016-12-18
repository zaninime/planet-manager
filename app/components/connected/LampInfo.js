import React from 'react';
import { connect } from 'react-redux';
import LampInfo from 'app/components/presentational/LampInfo';
import { getLampInfo } from 'app/redux/modules';

const mapStateToProps = (state, { lampId }) => getLampInfo(state, lampId);

const ConnectedLampInfo = connect(mapStateToProps)(LampInfo);

ConnectedLampInfo.propTypes = {
    lampId: React.PropTypes.string.isRequired,
};

export default ConnectedLampInfo;
