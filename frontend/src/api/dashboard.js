import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const dashboardApi = {
  getChannelStats: async (channelId) => {
    const response = await apiClient.get(`/dashboard/channel/${channelId}/stats`);
    return unwrapAxiosResponse(response);
  },
  getChannelVideos: async (channelId, params = {}) => {
    const response = await apiClient.get(`/dashboard/channel/${channelId}/videos`, {
      params,
    });
    return unwrapAxiosResponse(response);
  },
};
