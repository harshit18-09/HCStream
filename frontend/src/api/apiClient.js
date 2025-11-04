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
  // Prefer token from localStorage (explicitly stored on login) for Authorization header
  // fall back to zustand store if localStorage value not present. Keep cookie-based
  // credential behaviour unchanged (withCredentials: true) for httponly cookie flows.
  try {
    let token = null;
    try {
      token = localStorage.getItem("accessToken");
    } catch (e) {
      // localStorage may be unavailable in some environments; fall back to store
      token = null;
    }

    if (!token) {
      token = useAuthStore.getState().accessToken;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // don't fail request creation if store/localStorage access fails for any reason
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
