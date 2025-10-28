import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const commentApi = {
  getVideoComments: async (videoId, params = {}) => {
    const response = await apiClient.get(`/comments/${videoId}`, { params });
    return unwrapAxiosResponse(response);
  },
  addComment: async (videoId, payload) => {
    const response = await apiClient.post(`/comments/${videoId}`, payload);
    return unwrapAxiosResponse(response);
  },
  updateComment: async (commentId, payload) => {
    const response = await apiClient.put(`/comments/${commentId}`, payload);
    return unwrapAxiosResponse(response);
  },
  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return unwrapAxiosResponse(response);
  },
};
