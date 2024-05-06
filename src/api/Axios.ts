import axios from 'axios';
import { Navigate, redirect } from 'react-router-dom';
import { baseUrl } from './baseUrl';

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle unauthorized errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to home page
      redirect('/home')
    }
    return Promise.reject(error);
  }
);

export const Axios = api