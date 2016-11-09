import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ConnectPage from 'app/components/layout/connect';

export const makeRoutes = () =>
(
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
                        const mod = require('app/components/layout/day');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="night/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/night');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="twilight/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/twilight');
                        cb(null, mod.default);
                    });
                }}
            />
            <Route
                path="advanced/" getComponent={(location, cb) => {
                    require.ensure([], (require) => {
                        const mod = require('app/components/layout/advanced');
                        cb(null, mod.default);
                    });
                }}
            />
        </Route>
    </Route>
);

export default makeRoutes;
