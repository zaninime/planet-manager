import React from 'react';

const LayoutSwitch = ({ layoutMap, activeLayout }) => layoutMap[activeLayout];

LayoutSwitch.propTypes = {
    layoutMap: React.PropTypes.object.isRequired,
    activeLayout: React.PropTypes.string.isRequired,
};

export default LayoutSwitch;
