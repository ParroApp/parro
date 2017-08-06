import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

function sid(state = null, action) {
  switch (action.type) {
    case 'RECEIVE_STATUS':
      return action.sid;
    default:
      return state;
  }
}

function session(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_STATUS':
      return Object.assign(state, {
        status: action.status,
        name: action.name
      })
    default:
      return state;
  }
}

function speak(state = '', action) {
  switch (action.type) {
    case 'RECEIVE_STATUS':
      return `Hello ${action.name}! My name is Parro and I will be interviewing you today on behalf of Google. Please turn on your sound so we can have a chat.`;
    case 'TEST':
      return action.message;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  sid: sid,
  session: session,
  speak: speak,
  router: routerReducer
})

export default rootReducer;
