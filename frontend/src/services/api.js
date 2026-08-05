import axios from 'axios';

// Enterprise API Base URL Configuration with Environment Variable support
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Production-ready Axios instance with request/response interceptors
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15-second request timeout for resilience
});

// Request Interceptor: Automatically inject JWT Bearer authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling & 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear session on token expiration / unauthorized response
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
