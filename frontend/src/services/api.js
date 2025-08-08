import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  // Use a relative path. This will automatically point to the backend
  // on the same Vercel domain.
  baseURL: '/api',
  // This is required for cookies to work on the same domain
  withCredentials: true, 
});

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