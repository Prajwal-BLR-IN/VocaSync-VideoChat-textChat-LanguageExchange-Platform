import axios from "axios";

export const axiosInstanace = axios.create({
    baseURL: "http://localhost:4001/api",
    // baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
    withCredentials: true
})