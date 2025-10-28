import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const videoApi = {
  getVideos: async (params = {}) => {
    const response = await apiClient.get("/videos", { params });
    return unwrapAxiosResponse(response);
  },
  getVideoById: async (videoId) => {
    const response = await apiClient.get(`/videos/${videoId}`);
    return unwrapAxiosResponse(response);
  },
  publishVideo: async (payload) => {
    const formData = payload instanceof FormData ? payload : buildVideoForm(payload);
    const response = await apiClient.post("/videos", formData);
    return unwrapAxiosResponse(response);
  },
  updateVideo: async (videoId, payload) => {
    const formData = payload instanceof FormData ? payload : buildVideoForm(payload);
    const response = await apiClient.patch(`/videos/${videoId}`, formData);
    return unwrapAxiosResponse(response);
  },
  deleteVideo: async (videoId) => {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return unwrapAxiosResponse(response);
  },
  togglePublish: async (videoId) => {
    const response = await apiClient.patch(`/videos/toggle/publish/${videoId}`);
    return unwrapAxiosResponse(response);
  },
};

const buildVideoForm = (payload = {}) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  return formData;
};
