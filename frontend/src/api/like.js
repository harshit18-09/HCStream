import apiClient from "./apiClient";
import { unwrapAxiosResponse } from "./response";

export const likeApi = {
  toggleVideoLike: async (videoId) => {
    const response = await apiClient.post(`/likes/video/${videoId}/toggle`);
    return unwrapAxiosResponse(response);
  },
  toggleCommentLike: async (commentId) => {
    const response = await apiClient.post(`/likes/comment/${commentId}/toggle`);
    return unwrapAxiosResponse(response);
  },
  toggleTweetLike: async (tweetId) => {
    const response = await apiClient.post(`/likes/tweet/${tweetId}/toggle`);
    return unwrapAxiosResponse(response);
  },
  getLikedVideos: async () => {
    const response = await apiClient.get("/likes/liked");
    return unwrapAxiosResponse(response);
  },
};
