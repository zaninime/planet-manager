import React from 'react';
import Radium from 'radium';
import LoadingDialog from 'app/components/connected/LoadingDialog';
import DiscoveryItem from './DiscoveryItem';

const DiscoveryList = ({ load, lamps }) => {
    const items = Object.keys(lamps).map((value) => {
        const lamp = lamps[value];
        const { id, address } = lamp;

        return (
            <DiscoveryItem
                key={id}
                address={address}
                onClick={() => load(id)}
            />
        );
    });

    return (
        <div>
            {items}
            <LoadingDialog />
        </div>
    );
};

DiscoveryList.propTypes = {
    lamps: React.PropTypes.array.isRequired,
    load: React.PropTypes.func.isRequired,
};

export default Radium(DiscoveryList);
