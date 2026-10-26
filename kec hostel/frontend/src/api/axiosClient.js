import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer token automatically
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kec_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (localStorage.getItem('kec_auth_token')) {
        localStorage.removeItem('kec_auth_token');
        localStorage.removeItem('kec_auth_user');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
