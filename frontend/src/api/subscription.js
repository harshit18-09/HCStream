import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const subscriptionApi = {
  toggleSubscription: async (channelId) => {
    const response = await apiClient.post(`/subscriptions/c/${channelId}`);
    return unwrapAxiosResponse(response);
  },
  getSubscribedChannels: async (userId) => {
    const response = await apiClient.get(`/subscriptions/c/${userId}`);
    return unwrapAxiosResponse(response);
  },
  getChannelSubscribers: async (channelId) => {
    const response = await apiClient.get(`/subscriptions/u/${channelId}`);
    return unwrapAxiosResponse(response);
  },
};
