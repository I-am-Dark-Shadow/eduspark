import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: 'https://eduspark-vdqw.vercel.app/', // Your backend URL
});

// Interceptor to handle automatic logout on 401 response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the error is on a route other than login, it means the token is invalid/expired
      if (!error.config.url.includes('/api/users/login')) {
        useAuthStore.getState().logout();
        // Optionally redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;