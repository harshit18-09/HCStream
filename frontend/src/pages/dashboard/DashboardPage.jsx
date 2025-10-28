import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, Stack, Typography } from "@mui/material";
import MovieFilterRoundedIcon from "@mui/icons-material/MovieFilterRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { dashboardApi } from "../../api/dashboard";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import StatsCard from "../../components/dashboard/StatsCard";
import VideoGrid from "../../components/videos/VideoGrid";

const DashboardPage = () => {
  const { user } = useAuth();

  const statsQuery = useQuery({
    queryKey: ["dashboard", user?._id, "stats"],
    queryFn: () => dashboardApi.getChannelStats(user?._id),
    enabled: Boolean(user?._id),
  });

  const videosQuery = useQuery({
    queryKey: ["dashboard", user?._id, "videos"],
    queryFn: () => dashboardApi.getChannelVideos(user?._id, { limit: 12 }),
    enabled: Boolean(user?._id),
  });

  const statsPayload = statsQuery.data;
  const stats = useMemo(() => {
    if (!statsPayload) {
      return {};
    }
    if (statsPayload?.data) {
      return statsPayload.data;
    }
    if (statsPayload?.statusCode && typeof statsPayload.statusCode === "object") {
      return statsPayload.statusCode;
    }
    return statsPayload;
  }, [statsPayload]);

  const videosPayload = videosQuery.data;
  const videos = useMemo(() => {
    if (!videosPayload) {
      return [];
    }
    if (videosPayload?.videos) {
      return videosPayload.videos;
    }
    if (videosPayload?.data?.videos) {
      return videosPayload.data.videos;
    }
    if (Array.isArray(videosPayload?.data)) {
      return videosPayload.data;
    }
    return [];
  }, [videosPayload]);

  if (statsQuery.isPending || videosQuery.isPending) {
    return <LoadingScreen message="Preparing your dashboard..." />;
  }

  if (statsQuery.isError || videosQuery.isError) {
    return (
      <ErrorState
        description={
          statsQuery.error?.message ?? videosQuery.error?.message ?? "Unable to load dashboard"
        }
        onRetry={() => {
          statsQuery.refetch();
          videosQuery.refetch();
        }}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Creator dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard
            icon={<MovieFilterRoundedIcon />}
            title="Videos"
            value={stats?.totalVideos ?? 0}
            subtitle="Published content"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            icon={<PeopleAltRoundedIcon />}
            title="Subscribers"
            value={stats?.totalSubscribers ?? 0}
            subtitle="Community size"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            icon={<FavoriteRoundedIcon />}
            title="Likes"
            value={stats?.totalLikes ?? 0}
            subtitle="Across your videos"
          />
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          Recent uploads
        </Typography>
        {videos.length ? (
          <VideoGrid videos={videos} />
        ) : (
          <EmptyState title="No uploads yet" description="Publish a video to see analytics here." />
        )}
      </Stack>
    </Stack>
  );
};

export default DashboardPage;
