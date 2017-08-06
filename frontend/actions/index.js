import parro from '../api/parro';
import { push } from 'react-router-redux';

const receiveStatus = (sid, data) => ({
  type: 'RECEIVE_STATUS',
  sid,
  ...data
});

// Fetches status about session id (sid) and redirects user if sid is invalid.
// Relies on Redux Thunk middleware.
export const getAndVerifySession = (sid) => dispatch => {
  if (!sid) {
    dispatch(push('/error'));
    return;
  }
  parro.getStatus(sid)
  .then(({ data }) => {
    dispatch(receiveStatus(sid, data));
  })
  .catch(err => { // sessionId is invalid
    dispatch(push('/error'));
  })
};

export const redirect = (path) => dispatch => {
  dispatch(push(path));
};
