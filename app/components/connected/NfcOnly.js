import React from 'react';

const NfcOnly = ({ lampId, children }) => {
    if (lampId === 'nfc') {
        return children;
    }
    return null;
};

NfcOnly.propTypes = {
    children: React.PropTypes.node,
    lampId: React.PropTypes.string.isRequired,
};

export default NfcOnly;
