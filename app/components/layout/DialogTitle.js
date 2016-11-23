import React from 'react';
import Radium from 'radium';
import { gray800 } from 'material-ui/styles/colors';
import MaterialIcon from './MaterialIcon';

const styles = {
    title: {
        display: 'inline-block',
        marginLeft: '20px',
    },
    icon: {
        verticalAlign: 'text-top', // to center it, don't ask me why
        marginRight: '10px',
    },
};

const DialogTitle = ({ title, icon, color }) => {
    styles.title.color = color;

    let materialIcon;
    if (icon) {
        materialIcon = <MaterialIcon style={styles.icon}>{icon}</MaterialIcon>;
    }

    return (
        <h3 style={styles.title}>
            {materialIcon}
            {title}
        </h3>
    );
};

DialogTitle.propTypes = {
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string,
    color: React.PropTypes.string,
};

DialogTitle.defaultProps = {
    color: gray800,
};

export default Radium(DialogTitle);
