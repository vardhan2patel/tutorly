import axios from 'axios';

// Create an Axios instance
// Note: We use the vite proxy set up in vite.config.js for '/api' endpoints
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending/receiving cookies (JWT)
});

// Request Interceptor: can be used if we need to manually attach a Bearer Token from localStorage instead of httpOnly cookies
api.interceptors.request.use(
  (config) => {
    // If you switch from cookies to localStorage tokens, attach it here:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
