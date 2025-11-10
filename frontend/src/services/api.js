import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const API = axios.create({ baseURL: BASE });

API.interceptors.request.use((cfg) => {
  const user = JSON.parse(localStorage.getItem('sth_user') || 'null');
  if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
  return cfg;
}, (err) => Promise.reject(err));

API.interceptors.response.use(r => r, err => {
  // global error handling
  if (err.response && err.response.status === 401) {
    localStorage.removeItem('sth_user');
    window.location.reload();
  }
  return Promise.reject(err);
});

export default API;
