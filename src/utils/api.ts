import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setLoggedOut } from '@/store/slices/authSlice';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthRequest = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {          
          await API.get('/auth/refresh');
          return API(originalRequest);
        } catch (refreshError) {
          store.dispatch(setLoggedOut());
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;