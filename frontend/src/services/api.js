import axios from 'axios';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').trim();

// Use environment variable if provided, else fallback to localhost
let resolvedUrl = rawEnvUrl || 'http://localhost:5000/api';
resolvedUrl = resolvedUrl.replace(/\/+$/, '');
const API_URL = resolvedUrl.endsWith('/api') ? resolvedUrl : `${resolvedUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_user');
      localStorage.removeItem('portfolio_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    
    // Normalize error message
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({ ...error, message });
  }
);

export default api;
