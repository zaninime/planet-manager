import React from 'react';
import Radium from 'radium';
import DiscoveryItem from './DiscoveryItem';
import LoadingDialog from 'components/connected/LoadingDialog';

const DiscoveryList = ({ load, lamps }) => {
  const items = Object.keys(lamps).map((value) => {
    const lamp = lamps[value];
    const { id, address } = lamp;

    return (
      <DiscoveryItem
        key={id}
        address={address}
        onClick={() => load(id)} />
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
  load: React.PropTypes.func.isRequired
};

export default Radium(DiscoveryList);
