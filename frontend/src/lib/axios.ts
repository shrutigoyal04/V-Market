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
      Cookies.remove('token'); // Remove token from cookie
      window.location.href = '/login';
    }

    // --- Enhanced Error Handling ---
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        // Assume backend sends a 'message' field in its error response
        const backendMessage = (error.response.data as { message: string | string[] }).message;
        if (Array.isArray(backendMessage)) {
          errorMessage = backendMessage.join(', '); // Join multiple messages if it's an array
        } else {
          errorMessage = backendMessage; // Assign directly if it's a string
        }
      } else if (error.response.status) {
        // Fallback for status codes without a specific message from backend
        switch (error.response.status) {
          case 400:
            errorMessage = 'Bad Request: The server could not understand the request due to invalid syntax.';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource could not be found.';
            break;
          case 500:
            errorMessage = 'Internal Server Error: Something went wrong on the server.';
            break;
          // Add more cases as needed for specific status codes
          default:
            errorMessage = `Error: ${error.response.status} - ${error.response.statusText || 'Unknown Error'}`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Network Error: Could not connect to the server. Please check your internet connection.';
    }
    // --- End Enhanced Error Handling ---

    // Reject the promise with a custom Error object that includes the user-friendly message
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;