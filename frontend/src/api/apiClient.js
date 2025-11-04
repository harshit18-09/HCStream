import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    let token = null;
    try {
      token = localStorage.getItem("accessToken");
    } catch (e) {
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
