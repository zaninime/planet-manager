import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ConnectPage from 'app/components/layout/ConnectPage';

export const makeRoutes = () => (
    <Route path="/">
        <IndexRoute component={ConnectPage} />
        <Route
            path="(:lampId)/" getComponent={(location, cb) => {
                require.ensure([], (require) => {
                    const mod = require('app/components/layout/Container');
                    cb(null, mod.default);
                });
            }}
        >
            <Route
                path="day/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/DayPage');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="night/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/NightPage');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="twilight/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/TwilightPage');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="advanced/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/AdvancedPage');
                        cb(null, mod.default);
                    });
                }}
            />
        </Route>
    </Route>
);

export default makeRoutes;
