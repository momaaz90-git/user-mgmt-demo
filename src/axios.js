// src/axios.js
import axios from 'axios';

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: 'https://reqres.in/', // Set the base URL here
});

export default axiosInstance;
