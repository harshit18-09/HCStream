import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { playlistApi } from "../../api/playlist";
import { buildErrorMessage } from "../../api/response";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import PlaylistCard from "../../components/playlists/PlaylistCard";

const PlaylistsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState(null);

  const playlistsQuery = useQuery({
    queryKey: ["playlists", user?._id],
    queryFn: () => playlistApi.getUserPlaylists(user?._id),
    enabled: Boolean(user?._id),
  });

  const createPlaylistMutation = useMutation({
    mutationFn: () => playlistApi.createPlaylist(formState),
    onSuccess: () => {
      setFormState({ name: "", description: "" });
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
    },
    onError: (error) => {
      setFormError(buildErrorMessage(error));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.name.trim() || !formState.description.trim()) {
      setFormError("Name and description are required");
      return;
    }
    createPlaylistMutation.mutate();
  };

  const playlistsData = playlistsQuery.data;
  const playlists = Array.isArray(playlistsData?.data)
    ? playlistsData.data
    : Array.isArray(playlistsData?.statusCode)
    ? playlistsData.statusCode
    : Array.isArray(playlistsData)
    ? playlistsData
    : [];

  return (
    <Stack spacing={4}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Create a playlist
          </Typography>
          {formError ? <Alert severity="error">{formError}</Alert> : null}
          <TextField
            name="name"
            label="Playlist name"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            required
            fullWidth
          />
          <TextField
            name="description"
            label="Describe your playlist"
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            required
            fullWidth
            multiline
            minRows={2}
          />
          <Button type="submit" variant="contained" endIcon={<AddRoundedIcon />} disabled={createPlaylistMutation.isPending}>
            Save playlist
          </Button>
        </Stack>
      </Paper>
      {playlistsQuery.isPending ? (
        <LoadingScreen message="Loading your playlists..." />
      ) : playlistsQuery.isError ? (
        <ErrorState description={playlistsQuery.error?.message ?? "Unable to load playlists"} onRetry={playlistsQuery.refetch} />
      ) : playlists.length ? (
        <Grid container spacing={3}>
          {playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist._id}>
              <PlaylistCard playlist={playlist} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState title="No playlists yet" description="Create your first playlist to curate content." />
      )}
    </Stack>
  );
};

export default PlaylistsPage;
