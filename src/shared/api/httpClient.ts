import axios from 'axios';
import { env } from '../config/env';
import { toast } from 'sonner';

export const httpClient = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error(
        'Session expired. Please log in again from the main platform.',
      );
    }

    const message =
      error.response?.data?.message || 'An unexpected error occurred.';
    if (error.response?.status >= 500) {
      toast.error(`Server error. Please try again later. ${message}`);
    }

    return Promise.reject(error);
  },
);
