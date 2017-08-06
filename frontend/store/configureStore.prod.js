import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const configureStore = history => createStore(
  rootReducer,
  undefined,
  applyMiddleware(thunk, routerMiddleware(history))
);

export default configureStore;
