import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically add the token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Check if token exists and isn't the string "undefined"
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin"; // Force redirect on expired token
    }
    return Promise.reject(error);
  },
);

export default API;
