import { useQuery } from "@tanstack/react-query";
import { Stack, Typography } from "@mui/material";
import { likeApi } from "../../api/like";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import VideoGrid from "../../components/videos/VideoGrid";

const LikedVideosPage = () => {
  const likedQuery = useQuery({
    queryKey: ["likedVideos"],
    queryFn: likeApi.getLikedVideos,
  });

  if (likedQuery.isPending) {
    return <LoadingScreen message="Fetching liked videos..." />;
  }

  if (likedQuery.isError) {
    return <ErrorState description={likedQuery.error?.message ?? "Unable to fetch liked videos"} onRetry={likedQuery.refetch} />;
  }

  const payload = likedQuery.data;
  const videos = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.statusCode)
    ? payload.statusCode
    : Array.isArray(payload)
    ? payload
    : [];

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Liked videos
      </Typography>
      {videos.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No liked videos" description="Show some love to videos and they will appear here." />
      )}
    </Stack>
  );
};

export default LikedVideosPage;
