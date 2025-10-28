import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const authApi = {
  register: async (formData) => {
    const payload = formData instanceof FormData ? formData : buildRegistrationForm(formData);
    const response = await apiClient.post("/users/register", payload);
    return unwrapAxiosResponse(response);
  },
  login: async (credentials) => {
    const response = await apiClient.post("/users/login", credentials);
    return unwrapAxiosResponse(response);
  },
  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return unwrapAxiosResponse(response);
  },
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/current-user");
    return unwrapAxiosResponse(response);
  },
  changePassword: async (payload) => {
    const response = await apiClient.post("/users/change-password", payload);
    return unwrapAxiosResponse(response);
  },
  updateAccount: async (payload) => {
    const response = await apiClient.patch("/users/update-account", payload);
    return unwrapAxiosResponse(response);
  },
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiClient.patch("/users/avatar", formData);
    return unwrapAxiosResponse(response);
  },
  updateCoverImage: async (file) => {
    const formData = new FormData();
    formData.append("coverImage", file);
    const response = await apiClient.patch("/users/cover-image", formData);
    return unwrapAxiosResponse(response);
  },
  getChannelProfile: async (username) => {
    const response = await apiClient.get(`/users/c/${username}`);
    return unwrapAxiosResponse(response);
  },
  getWatchHistory: async () => {
    const response = await apiClient.get("/users/watch-history");
    return unwrapAxiosResponse(response);
  },
};

const buildRegistrationForm = (payload) => {
  const formData = new FormData();
  Object.entries(payload ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};
