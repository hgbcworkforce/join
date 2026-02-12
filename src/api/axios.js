// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// // Automatically add the token to every request
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers["x-access-token"] = token;
//   }
//   return config;
// });

// // Handle global errors (like 401 Unauthorized)
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {

//         console.log("Interceptor caught error:", error.response?.status);
//     console.log("Error details:", error.response?.data);

//     if (error.response?.status === 401) {
//      // localStorage.removeItem("token");
//       //window.location.href = "/signin"; // Force redirect on expired token
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;


import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    // 1. Log this to your console to verify the token is found
    console.log("Interceptor attaching token:", token.substring(0, 10) + "...");
    
    // 2. Ensure this matches your Postman 'Key' exactly
    config.headers["x-access-token"] = token;
  } else {
    console.warn("No token found in localStorage!");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor (Keep the 401 redirect commented out for now while testing!)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default API;
