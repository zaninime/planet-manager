import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ConnectPage from './connectPage/ConnectPage';
import DayPage from './dayPage/DayPage';

export const makeMainRoutes = () => {
  return (
    <Route path="/">
      <Route path="/config" getComponent={(location, cb) => {
        require.ensure([], (require) => {
          const mod = require('./Container');
          cb(null, mod.default);
        });
      }}>
        <IndexRoute component={DayPage} />
        <Route path="/day" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('./dayPage/DayPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="/night" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('./nightPage/NightPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="/twilight" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('./twilightPage/TwilightPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="/advanced" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('./advancedPage/AdvancedPage');
            cb(null, mod.default);
          });
        }} />
      </Route>

      {/* inline loading */}
      <IndexRoute component={ConnectPage} />
    </Route>
  );
};

export default makeMainRoutes;
