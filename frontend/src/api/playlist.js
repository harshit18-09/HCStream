import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const playlistApi = {
  createPlaylist: async (payload) => {
    const response = await apiClient.post("/playlists", payload);
    return unwrapAxiosResponse(response);
  },
  getUserPlaylists: async (userId) => {
    const response = await apiClient.get(`/playlists/user/${userId}`);
    return unwrapAxiosResponse(response);
  },
  getPlaylist: async (playlistId) => {
    const response = await apiClient.get(`/playlists/${playlistId}`);
    return unwrapAxiosResponse(response);
  },
  updatePlaylist: async (playlistId, payload) => {
    const response = await apiClient.patch(`/playlists/${playlistId}`, payload);
    return unwrapAxiosResponse(response);
  },
  deletePlaylist: async (playlistId) => {
    const response = await apiClient.delete(`/playlists/${playlistId}`);
    return unwrapAxiosResponse(response);
  },
  addVideoToPlaylist: async (playlistId, videoId) => {
    const response = await apiClient.patch(`/playlists/${playlistId}/video/${videoId}`);
    return unwrapAxiosResponse(response);
  },
  removeVideoFromPlaylist: async (playlistId, videoId) => {
    const response = await apiClient.patch(`/playlists/${playlistId}/video/${videoId}/remove`);
    return unwrapAxiosResponse(response);
  },
};
