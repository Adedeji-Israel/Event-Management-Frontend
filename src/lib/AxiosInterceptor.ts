import axios, { AxiosError } from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // sends the httpOnly refreshToken cookie
  timeout: 35000,
});

/* ============ IN-MEMORY ACCESS TOKEN ============ */
// Deliberately NOT localStorage — an XSS payload reading localStorage
// would otherwise get a live, usable credential.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

/* ================= REQUEST ================= */
api.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ============ REFRESH (bypasses interceptors to avoid recursion) ============ */
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      `${baseUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken = data?.data?.token ?? null;
    setAccessToken(newToken);
    return newToken;
  } catch {
    setAccessToken(null);
    return null;
  }
};

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;
    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");
    const isLoginCall = originalRequest?.url?.includes("/auth/login");

    // Attempt exactly one silent refresh-and-retry per request
    if (status === 401 && !originalRequest._retry && !isRefreshCall && !isLoginCall) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      // Refresh genuinely failed — session is over
      if (!window.location.pathname.includes("/auth/login")) {
        window.location.href = "/auth/login";
      }
    }

    const message =
      error.response?.data?.message ||
      (error.request ? "Network error. Please check your connection." : error.message) ||
      "Something went wrong";

    return Promise.reject({ message, status, original: error });
  }
);

export default api;
