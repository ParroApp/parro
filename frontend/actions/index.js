import parro from '../api/parro';
import { push } from 'react-router-redux';

const receiveStatus = (sid, data) => ({
  type: 'RECEIVE_STATUS',
  sid,
  ...data
});

// Fetches status about session id (sid) and redirects user if sid is invalid.
// Relies on Redux Thunk middleware.
export const getAndVerifySession = (sid) => (dispatch, getState) => {
  if (!sid) {
    dispatch(push('/error'));
    return;
  }
  setTimeout(() => {
    if (!getState().sid) {
      dispatch(push('/slow')); // Connection too slow
    }
  }, 4000);
  parro.getStatus(sid)
  .then(({ data }) => {
    dispatch(receiveStatus(sid, data));
  })
  .catch(err => { // sessionId is invalid
    dispatch(push('/error'));
  })
};

const receiveBehavioral = (data) => ({
  type: 'RECEIVE_BEHAVIORAL',
  ...data
})

export const getBehavioral = () => (dispatch, getState) => {
  if (!getState().sid) {
    dispatch(push('/error'));
    return;
  }
  parro.getBehavioral(getState().sid)
  .then(({ data }) => {
    dispatch(receiveStatus(getState().sid, data.session));
    dispatch(receiveBehavioral(data.behavioral));
  })
  .catch(err => { // sessionId is invalid
    console.log('err', err);
    dispatch(push('/error'));
  })
};

export const redirect = (path) => dispatch => {
  dispatch(push(path));
};

export const showBehavioralButton = () => ({
  type: 'SHOW_BEHAVIORAL_BUTTON'
})

export const startTimer = (minutes) => ({
  type: 'START_TIMER',
  minutes
})

export const stopTimer = () => ({
  type: 'STOP_TIMER'
})
