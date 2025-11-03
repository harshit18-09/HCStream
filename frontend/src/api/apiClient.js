import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Attach Authorization header from zustand store if available. This is a fallback
  // to support environments where httponly cookies are not being persisted/sent
  // (for example when frontend is served over HTTP from S3 website endpoints).
  // Note: storing tokens in JS-visible storage reduces security compared to httponly cookies.
  try {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // don't fail request creation if store access fails for any reason
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
