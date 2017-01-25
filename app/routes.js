import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Container from 'app/components/layout/Container';
import ConnectPage from 'app/components/layout/ConnectPage';
import DayPage from 'app/components/layout/DayPage';
import NightPage from 'app/components/layout/NightPage';
import TwilightPage from 'app/components/layout/TwilightPage';
import AdvancedPage from 'app/components/layout/AdvancedPage';

const routes = (
    <Route path="/">
        <IndexRoute component={ConnectPage} />
        <Route path="(:lampId)/" component={Container}>
            <Route path="day/" component={DayPage} />
            <Route path="night/" component={NightPage} />
            <Route path="twilight/" component={TwilightPage} />
            <Route path="advanced/" component={AdvancedPage} />
        </Route>
    </Route>
);

export default routes;
