import React from 'react';
import Radium from 'radium';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ChevronCheckIcon from 'material-ui/svg-icons/navigation/chevron-left';
import { grey400 } from 'material-ui/styles/colors';

const BackButton = ({ style, onClick, replace }) => {
    const handleClick = () => {
        if (onClick !== undefined) onClick();
        if (replace !== undefined) replace('/');
    };

    return (
        <FloatingActionButton
            style={style}
            mini
            backgroundColor={grey400}
            onClick={handleClick}
        >
            <ChevronCheckIcon />
        </FloatingActionButton>
    );
};

BackButton.propTypes = {
    style: React.PropTypes.object,
    onClick: React.PropTypes.func,
    replace: React.PropTypes.func,
};

export default Radium(BackButton);
