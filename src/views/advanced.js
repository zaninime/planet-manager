import React from 'react';
import Section from 'views/Section/Section';
import ChannelMap  from 'containers/ChannelMap/ChannelMap';
import WifiSettings from 'containers/WifiSettings/WifiSettings';
import Misc from 'containers/Misc/Misc';

const AdvancedPage = ({ params }) => {
  return (
    <div>
      <Section title="Wi-Fi">
        <WifiSettings lampId={params.lampId} />
      </Section>

      <Misc lampId={params.lampId} />
      <ChannelMap lampId={params.lampId} />
    </div>
  );
};

AdvancedPage.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default AdvancedPage;
