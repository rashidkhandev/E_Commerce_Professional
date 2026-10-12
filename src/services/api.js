import axios from 'axios';

// Create central Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: attach bearer token if stored locally
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rashid_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors consistently
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If 401 Unauthorized received, clear local session if token expired
    if (error.response?.status === 401) {
      if (localStorage.getItem('rashid_token')) {
        localStorage.removeItem('rashid_token');
        localStorage.removeItem('rashid_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
