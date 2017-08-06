import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Routes from '../routes';
import DevTools from './DevTools';
import { ConnectedRouter } from 'react-router-redux';

console.log(ConnectedRouter);

const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
      <DevTools />
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
