import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    if (window.location.pathname !== "/login")
      window.location.href = "/login";
    // await refreshToken();
    // return instance(error.config); // Retry original request
  }
  return Promise.reject(error);
});

export default client;