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
      return Object.assign({}, state, {
        name: action.name,
        status: action.status,
        next_status: action.next_status
      })
    default:
      return state;
  }
}

function speak(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_STATUS':
      // return `Hello ${action.name}! My name is Parro and I will be interviewing you today on behalf of Google. Please turn on your sound so we can have a chat.`;
      return Object.assign({}, state, {
        message: `Hello ${action.name}! My name is Parro and I will be interviewing you today on behalf of Google. Please turn on your sound so we can have a chat.`
      });
    case 'RECEIVE_BEHAVIORAL':
      return Object.assign({}, state, {
        message: action.message
      });
    case 'TEST':
      return action.message;
    default:
      return state;
  }
}

function behavioral(state = {}, action) {
  switch (action.type) {
    case 'SHOW_BEHAVIORAL_BUTTON':
      return Object.assign({}, state, { showButton: true });
    default:
      return state;
  }
}

function timer(state = null, action) {
  switch (action.type) {
    case 'START_TIMER':
      return action.minutes;
    case 'STOP_TIMER':
      return null;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  sid: sid,
  session: session,
  speak: speak,
  behavioral: behavioral,
  timer: timer,
  router: routerReducer
})

export default rootReducer;
