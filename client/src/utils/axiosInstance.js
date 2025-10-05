import axios from "axios";

export const axiosInstanace = axios.create({
  baseURL: process.meta.env.Backend_URL,
  // baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});
