import axios from 'axios';

const request = axios.create({
  baseURL: `${window.location.origin}/api/v4/projects/`,
});

export default request;
