import React from 'react';
import Section from 'app/components/layout/Section';
import ChannelMap from 'app/components/connected/ChannelMap';
import WifiSettings from 'app/components/connected/WifiSettings';
import Misc from 'app/components/connected/Misc';

const AdvancedPage = ({ params }) => (
    <div>
        <Section title="Wi-Fi">
            <WifiSettings lampId={params.lampId} />
        </Section>

        <Misc lampId={params.lampId} />
        <ChannelMap lampId={params.lampId} />
    </div>
);

AdvancedPage.propTypes = {
    params: React.PropTypes.object.isRequired,
};

export default AdvancedPage;
