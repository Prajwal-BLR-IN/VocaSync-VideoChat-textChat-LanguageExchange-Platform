import axios from "axios";

export const axiosInstanace = axios.create({
    baseURL: "http://localhost:4001/api",
    withCredentials: true
})