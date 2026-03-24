// src/lib/AxiosInterceptor.ts
import axios, { AxiosError } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 35000,
});

/* ================= REQUEST ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    let message = "Something went wrong";

    if (error.response) {
      const { status, data } = error.response;

      message = data?.message || message;

      // 🔥 Handle auth globally
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 🔥 Prevent redirect loop
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }

    } else if (error.request) {
      message = "Network error. Please check your connection.";
    } else {
      message = error.message;
    }

    // 🔥 VERY IMPORTANT: return CLEAN error
    return Promise.reject({
      message,
      status: error.response?.status,
      original: error,
    });
  }
);

export default api;