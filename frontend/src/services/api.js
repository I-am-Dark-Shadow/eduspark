import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  // Use a relative path. This will automatically point to your Vercel backend.
  baseURL: '/api',
  // withCredentials is now needed for cookies to work on the same domain
  withCredentials: true, 
});

// Interceptor to handle automatic logout on 401 response
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