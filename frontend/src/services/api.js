import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  // CHANGE THIS: Use a relative path for production
  baseURL: '/api',
});

// The interceptor can be simplified as withCredentials is now needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/users/login')) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;