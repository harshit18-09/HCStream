import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { playlistApi } from "../../api/playlist";
import { buildErrorMessage } from "../../api/response";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const queryClient = useQueryClient();

  const playlistQuery = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => playlistApi.getPlaylist(playlistId),
    enabled: Boolean(playlistId),
  });

  const removeVideoMutation = useMutation({
    mutationFn: (videoId) => playlistApi.removeVideoFromPlaylist(playlistId, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    },
  });

  const playlist = useMemo(() => {
    const payload = playlistQuery.data;
    if (!payload) {
      return null;
    }
    if (payload?.data) {
      return payload.data;
    }
    return payload;
  }, [playlistQuery.data]);

  const handleRemove = (videoId) => {
    removeVideoMutation.mutate(videoId);
  };

  if (playlistQuery.isPending) {
    return <LoadingScreen message="Loading playlist..." />;
  }

  if (playlistQuery.isError || !playlist) {
    return <ErrorState description={playlistQuery.error?.message ?? "Playlist not found"} onRetry={playlistQuery.refetch} />;
  }

  const videos = playlist.videos ?? [];

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            {playlist.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Playlist ID: {playlist._id}
          </Typography>
        </Stack>
      </Paper>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Videos
        </Typography>
        {removeVideoMutation.isError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {buildErrorMessage(removeVideoMutation.error)}
          </Alert>
        ) : null}
        {videos.length ? (
          <Stack spacing={2}>
            {videos.map((videoId) => (
              <Box
                key={videoId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="body2">Video ID: {videoId}</Typography>
                <Button
                  color="error"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={() => handleRemove(videoId)}
                  disabled={removeVideoMutation.isPending}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState title="No videos in this playlist" description="Add videos to start curating." />
        )}
      </Paper>
    </Stack>
  );
};

export default PlaylistDetailPage;
