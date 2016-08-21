import React from 'react';
import Radium, { Style } from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import Section from 'views/main/common/Section/Section';
import BoundChannelMap from 'containers/advanced/channelMapping/BoundChannelMap/BoundChannelMap';
import ClientSettings from 'components/advanced/wifi/ClientSettings/ClientSettings';
import DhcpSettings from 'components/advanced/wifi/DhcpSettings/DhcpSettings';
import Misc from '../misc/Misc';

const styles = {
  content: {
    width: '80%',
    margin: 'auto'
  },
  'p': {
    marginBottom: '0px'
  }
};

const AdvancedPage = () => {
  return (
    <div style={styles.page}>
      <Section title="Wifi">
        <Style rules={{ p: styles.p }} />
        <div style={styles.content}>
          <ClientSettings />
          <DhcpSettings />
          <RaisedButton
            style={styles.button}
            primary={true}
            label="Apply wifi settings" />
        </div>
      </Section>

      <Misc />

      <Section title="Channel Mapping">
        <BoundChannelMap />
      </Section>
    </div>
  );
};

export default Radium(AdvancedPage);
