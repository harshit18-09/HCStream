import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const tweetApi = {
  createTweet: async (payload) => {
    const response = await apiClient.post("/tweets", payload);
    return unwrapAxiosResponse(response);
  },
  getUserTweets: async (userId) => {
    const response = await apiClient.get(`/tweets/user/${userId}`);
    return unwrapAxiosResponse(response);
  },
  updateTweet: async (tweetId, payload) => {
    const response = await apiClient.patch(`/tweets/${tweetId}`, payload);
    return unwrapAxiosResponse(response);
  },
  deleteTweet: async (tweetId) => {
    const response = await apiClient.delete(`/tweets/${tweetId}`);
    return unwrapAxiosResponse(response);
  },
};
