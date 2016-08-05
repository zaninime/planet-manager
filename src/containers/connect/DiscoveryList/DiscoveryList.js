import { connect } from 'react-redux';
import LampsList from 'components/connect/LampsList/LampsList';

const mapStateToProps = ({discovery}) => {
  const ids = discovery.ids;
  const byId = discovery.byId;

  return {
    lamps: ids.map(id => {
      const lamp = byId[id];
      const twentySeconds = 20 * 1000; // ms

      if(lamp !== undefined && (new Date() - lamp.lastSeen) < twentySeconds)
        return lamp;
    })
  };
};

export default connect(mapStateToProps)(LampsList);
