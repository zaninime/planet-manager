import React from 'react';
import Section from 'components/views/Section';
import ChannelMap  from 'components/connected/ChannelMap';
import WifiSettings from 'components/connected/WifiSettings';
import Misc from 'components/connected/Misc';

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
