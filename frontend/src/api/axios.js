import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bookexchangeproject-backend.onrender.com', // backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
