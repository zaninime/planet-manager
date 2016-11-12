import React from 'react';

const filterProps = (...propsToRemove) => (Component) => {
    const PropFilter = (props) => {
        const propsToPass = Object.keys(props)
            .filter(element => propsToRemove.indexOf(element) < 0)
            .reduce((acc, element) => ({ ...acc, [element]: props[element] }), {});
        return <Component {...propsToPass} />;
    };

    return PropFilter;
};

export default filterProps;
