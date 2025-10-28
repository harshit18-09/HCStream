import { useQuery } from "@tanstack/react-query";
import { Stack, Typography } from "@mui/material";
import { authApi } from "../../api/auth";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import VideoGrid from "../../components/videos/VideoGrid";

const WatchHistoryPage = () => {
  const historyQuery = useQuery({
    queryKey: ["watchHistory"],
    queryFn: authApi.getWatchHistory,
  });

  if (historyQuery.isPending) {
    return <LoadingScreen message="Loading your watch history..." />;
  }

  if (historyQuery.isError) {
    return <ErrorState description={historyQuery.error?.message ?? "Unable to load history"} onRetry={historyQuery.refetch} />;
  }

  const payload = historyQuery.data;
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
        Watch history
      </Typography>
      {videos.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No history yet" description="Your latest plays will show up here." />
      )}
    </Stack>
  );
};

export default WatchHistoryPage;
