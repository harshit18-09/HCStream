import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { tweetApi } from "../../api/tweet";
import { buildErrorMessage } from "../../api/response";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { formatRelativeTime } from "../../utils/formatters";

const TweetsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTweet, setNewTweet] = useState("");
  const [formError, setFormError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const tweetsQuery = useQuery({
    queryKey: ["tweets", user?._id],
    queryFn: () => tweetApi.getUserTweets(user?._id),
    enabled: Boolean(user?._id),
  });

  const createMutation = useMutation({
    mutationFn: () => tweetApi.createTweet({ content: newTweet }),
    onSuccess: () => {
      setNewTweet("");
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
    onError: (error) => {
      setFormError(buildErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => tweetApi.updateTweet(editingId, { content: editingValue }),
    onSuccess: () => {
      setEditingId(null);
      setEditingValue("");
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
    onError: (error) => {
      setFormError(buildErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (tweetId) => tweetApi.deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets", user?._id] });
    },
    onError: (error) => {
      setFormError(buildErrorMessage(error));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newTweet.trim()) {
      setFormError("Tweet content is required");
      return;
    }
    createMutation.mutate();
  };

  const payload = tweetsQuery.data;
  const tweets = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.statusCode)
    ? payload.statusCode
    : Array.isArray(payload)
    ? payload
    : [];

  if (tweetsQuery.isPending) {
    return <LoadingScreen message="Loading your tweets..." />;
  }

  if (tweetsQuery.isError) {
    return <ErrorState description={tweetsQuery.error?.message ?? "Unable to load tweets"} onRetry={tweetsQuery.refetch} />;
  }

  return (
    <Stack spacing={3}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Share an update
          </Typography>
          {formError ? <Alert severity="error">{formError}</Alert> : null}
          <TextField
            value={newTweet}
            onChange={(event) => setNewTweet(event.target.value)}
            placeholder="Announce something to your subscribers"
            fullWidth
            multiline
            minRows={2}
          />
          <Button type="submit" variant="contained" endIcon={<SendRoundedIcon />} disabled={createMutation.isPending}>
            Publish
          </Button>
        </Stack>
      </Paper>
      {tweets.length ? (
        <Stack spacing={2}>
          {tweets.map((tweet) => {
            const isEditing = editingId === tweet._id;
            return (
              <Paper key={tweet._id} sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" color="text.secondary">
                    {formatRelativeTime(tweet.createdAt)}
                  </Typography>
                  {isEditing ? (
                    <TextField
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                    />
                  ) : (
                    <Typography variant="body1">{tweet.content}</Typography>
                  )}
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {isEditing ? (
                      <>
                        <Button
                          startIcon={<SaveRoundedIcon />}
                          variant="contained"
                          size="small"
                          onClick={() => updateMutation.mutate()}
                          disabled={updateMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<CloseRoundedIcon />}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEditingId(null);
                            setEditingValue("");
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingId(tweet._id);
                            setEditingValue(tweet.content);
                          }}
                        >
                          <EditRoundedIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => deleteMutation.mutate(tweet._id)}>
                          <DeleteRoundedIcon fontSize="inherit" />
                        </IconButton>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <EmptyState title="No tweets yet" description="Use tweets to keep your community updated." />
      )}
    </Stack>
  );
};

export default TweetsPage;
