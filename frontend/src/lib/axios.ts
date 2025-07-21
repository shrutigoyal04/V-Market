import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie'; // Add this import

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      // const token = localStorage.getItem('token'); // Remove or comment out this line
      const token = Cookies.get('token'); // Read token from cookie
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // localStorage.removeItem('token'); // Remove or comment out this line
      Cookies.remove('token'); // Remove token from cookie
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;