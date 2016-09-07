import React from 'react';
import Radium, { Style } from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import Section from 'views/Section/Section';
import ChannelMap  from 'containers/ChannelMap/ChannelMap';
import ClientSettings from 'components/ClientSettings/ClientSettings';
import DhcpSettings from 'components/DhcpSettings/DhcpSettings';
import Misc from 'views/Misc/Misc';

const styles = {
  content: {
    width: '80%',
    margin: 'auto'
  },
  p: {
    marginBottom: '0px'
  }
};

const AdvancedPage = ({ params }) => {
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

      <Misc lampId={params.lampId} />
      <Section title="Channel Mapping">
        <ChannelMap lampId={params.lampId} />
      </Section>
    </div>
  );
};

AdvancedPage.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default Radium(AdvancedPage);
