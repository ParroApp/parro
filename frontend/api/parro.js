import axios from 'axios';

export default {
  getStatus: (sessionId) => {
    return axios.get(`/api/status?sid=${sessionId}`);
  },
  getBehavioral: (sessionId) => {
    return axios.get(`/api/behavioral?sid=${sessionId}`);
  },
  postBehavioral: (sessionId, interviewState, blob) => {
    const formData = new FormData();
    formData.append('state', interviewState);
    formData.append('content', blob); // assume audio

    return axios.post(`/api/behavioral?sid=${sessionId}`, formData);
  }
}
