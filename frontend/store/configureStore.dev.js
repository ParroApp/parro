import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const configureStore = history => createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(thunk, routerMiddleware(history), createLogger()),
    DevTools.instrument()
  )
);

export default configureStore;
