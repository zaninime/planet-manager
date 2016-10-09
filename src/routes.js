import React from 'react';
import { Route, IndexRoute } from 'react-router';
import ConnectPage from 'components/views/connect';

export const makeRoutes = () => {
  return (
    <Route path='/'>
      <IndexRoute component={ConnectPage} />
      <Route path='(:lampId)/' getComponent={(location, cb) => {
        require.ensure([], (require) => {
          const mod = require('components/views/Container');
          cb(null, mod.default);
        });
      }}>
        <Route path='day/' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('components/views/day');
            cb(null, mod.default);
          });
        }} />
        <Route path='night/' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('components/views/night');
            cb(null, mod.default);
          });
        }} />
        <Route path='twilight/' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('components/views/twilight');
            cb(null, mod.default);
          });
        }} />
        <Route path='advanced/' getComponent={(location, cb) => {
          require.ensure([], (require) => {
            const mod = require('components/views/advanced');
            cb(null, mod.default);
          });
        }} />
      </Route>
    </Route>
  );
};

export default makeRoutes;
