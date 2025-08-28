import axios from 'axios';

// Get the base API URL from environment variables or use the default
const getApiBaseUrl = () => {
  // For production
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_API_URL || 'https://ai-powered-pc-builder-backend.vercel.app';
  }
  
  // For development
  return 'http://localhost:11822';
};

// Create and export an axios instance with the correct base URL
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
