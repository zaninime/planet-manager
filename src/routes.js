import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ConnectPage from 'views/main/connectPage/ConnectPage';

export const makeRoutes = () => {
  return (
    <Route path='/'>
      <IndexRoute component={ConnectPage} />
      <Route path=':lampId/' getComponent={(location, cb) => {
        require.ensure([], (require) => {
          const mod = require('views/main/Container');
          cb(null, mod.default);
        });
      }}>
        <Route path="day/" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('views/main/dayPage/DayPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="night/" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('views/main/nightPage/NightPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="twilight/" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('views/main/twilightPage/TwilightPage');
            cb(null, mod.default);
          });
        }} />
        <Route path="advanced/" getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('views/main/advancedPage/AdvancedPage');
            cb(null, mod.default);
          });
        }} />
      </Route>
    </Route>
  );
};

export default makeRoutes;
