import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from "@mui/material";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { videoApi } from "../../api/video";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import VideoGrid from "../../components/videos/VideoGrid";

const sortOptions = [
  { value: "createdAt", label: "Latest", icon: <CalendarMonthRoundedIcon fontSize="small" /> },
  { value: "views", label: "Popular", icon: <TrendingUpRoundedIcon fontSize="small" /> },
  { value: "duration", label: "Duration", icon: <AccessTimeRoundedIcon fontSize="small" /> },
];

const VideoFeedPage = () => {
  const { searchTerm } = useOutletContext() ?? { searchTerm: "" };
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");

  const filters = useMemo(() => ({ query: searchTerm, sortBy, sortType }), [searchTerm, sortBy, sortType]);

  const videosQuery = useQuery({
    queryKey: ["videos", filters],
    queryFn: () => videoApi.getVideos({ ...filters, limit: 24 }),
    keepPreviousData: true,
  });

  if (videosQuery.isPending) {
    return <LoadingScreen message="Fetching the latest uploads..." />;
  }

  if (videosQuery.isError) {
    return <ErrorState description={videosQuery.error?.message ?? "Unable to load videos"} onRetry={videosQuery.refetch} />;
  }

  const payload = videosQuery.data ?? {};
  const videos = Array.isArray(payload.videos) ? payload.videos : Array.isArray(payload) ? payload : payload?.data ?? [];

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Explore content
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? `Results for "${searchTerm}"` : "Discover videos from the community"}
          </Typography>
        </Box>
        <ButtonGroup variant="outlined" size="medium">
          <Button startIcon={<SortRoundedIcon />} onClick={() => setSortType((prev) => (prev === "asc" ? "desc" : "asc"))}>
            {sortType === "asc" ? "Ascending" : "Descending"}
          </Button>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "contained" : "outlined"}
              startIcon={option.icon}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
      {videos?.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <EmptyState title="No videos found" description="Try adjusting your filters or check back later." />
      )}
    </Stack>
  );
};

export default VideoFeedPage;
