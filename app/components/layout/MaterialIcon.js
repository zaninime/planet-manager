import React from 'react';
import Radium from 'radium';

const styles = {
    materialIcons: {
        fontFamily: 'Material Icons',
        fontWeight: 'normal',
        fontStyle: 'normal',
        display: 'inline-block',
        lineHeight: '1',
        textTransform: 'none',
        letterSpacing: 'normal',
        wordWrap: 'normal',
        whiteSpace: 'nowrap',
        direction: 'ltr',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
        MozOsxFontSmoothing: 'grayscale',
        FontFeatureSettings: 'liga',
    },
};

const MaterialIcon = ({ children, style }) => (
    <i style={[styles.materialIcons, style]}>{children}</i>
);

MaterialIcon.propTypes = {
    children: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
};

export default Radium(MaterialIcon);
