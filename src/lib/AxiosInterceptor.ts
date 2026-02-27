// src/api/AxiosInterceptor.ts
import axios, { AxiosError } from "axios"

const baseUrl = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 35000,
})

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response

      console.error("API Error:", {
        status,
        message: (data as any)?.message,
        url: error.config?.url,
      })

      if (status === 401) {
        localStorage.removeItem("token")
      }
    } else if (error.request) {
      console.error("Network error. Server not responding.")
    } else {
      console.error("Axios config error:", error.message)
    }

    return Promise.reject(error)
  }
)

export default api
