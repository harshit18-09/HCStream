import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import SubscriptionsRoundedIcon from "@mui/icons-material/SubscriptionsRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { videoApi } from "../../api/video";
import { aiApi } from "../../api/ai";
import { likeApi } from "../../api/like";
import { subscriptionApi } from "../../api/subscription";
import { commentApi } from "../../api/comment";
import { authApi } from "../../api/auth";
import { buildErrorMessage } from "../../api/response";
import LoadingScreen from "../../components/common/LoadingScreen";
import ErrorState from "../../components/common/ErrorState";
import VideoPlayer from "../../components/videos/VideoPlayer";
import CommentComposer from "../../components/comments/CommentComposer";
import CommentList from "../../components/comments/CommentList";
import EmptyState from "../../components/common/EmptyState";
import { formatNumber, formatRelativeTime } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [commentError, setCommentError] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState(null);

  const videoQuery = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => videoApi.getVideoById(videoId),
    enabled: Boolean(videoId),
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => commentApi.getVideoComments(videoId, { limit: 50 }),
    enabled: Boolean(videoId),
  });

  const video = useMemo(() => {
    const payload = videoQuery.data;
    if (!payload) {
      return null;
    }
    if (payload?.video) {
      return payload.video;
    }
    if (payload?.data) {
      return payload.data;
    }
    return payload;
  }, [videoQuery.data]);

  const ownerUsername = video?.owner?.username;
  const ownerId = video?.owner?._id;

  const channelQuery = useQuery({
    queryKey: ["channel", ownerUsername],
    queryFn: () => authApi.getChannelProfile(ownerUsername),
    enabled: Boolean(ownerUsername),
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => likeApi.toggleVideoLike(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
    },
  });

  const toggleSubscriptionMutation = useMutation({
    mutationFn: () => subscriptionApi.toggleSubscription(ownerId),
    onSuccess: () => {
      channelQuery.refetch();
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => commentApi.addComment(videoId, { content }),
    onSuccess: () => {
      setCommentError(null);
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
    onError: (error) => {
      setCommentError(buildErrorMessage(error));
    },
  });

  const commentsPayload = commentsQuery.data;
  const comments = useMemo(() => {
    if (!commentsPayload) {
      return [];
    }
    if (Array.isArray(commentsPayload)) {
      return commentsPayload;
    }
    if (Array.isArray(commentsPayload?.data)) {
      return commentsPayload.data;
    }
    if (Array.isArray(commentsPayload?.comments)) {
      return commentsPayload.comments;
    }
    if (Array.isArray(commentsPayload?.statusCode)) {
      return commentsPayload.statusCode;
    }
    return [];
  }, [commentsPayload]);

  if (videoQuery.isPending) {
    return <LoadingScreen message="Loading video..." />;
  }

  if (videoQuery.isError || !video) {
    return <ErrorState description={videoQuery.error?.message ?? "Video not found"} onRetry={videoQuery.refetch} />;
  }

  const channelData = channelQuery.data?.data ?? channelQuery.data?.statusCode ?? channelQuery.data;
  const isSubscribed = channelData?.isSubscribed;
  const subscriberCount = channelData?.subscribersCount;
  const isOwner = user?._id && ownerId && user._id === ownerId;

  const handleCommentSubmit = (content, onSuccess) => {
    addCommentMutation.mutate(content, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Stack spacing={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <VideoPlayer src={video.videoFile} poster={video.thumbnail} />
            {/* Transcript display (Tailwind classes included if the project has Tailwind) */}
            <Box>
              {transcribeError ? (
                <Alert severity="error">{transcribeError}</Alert>
              ) : null}
              {transcript ? (
                <Box className="prose max-w-none bg-white dark:bg-gray-800 rounded-lg p-4 mt-3 shadow-sm" sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Transcript
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {transcript}
                  </Typography>
                </Box>
              ) : (
                isTranscribing ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">Generating transcript — this may take a while.</Typography>
                  </Box>
                ) : null
              )}
            </Box>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {video.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Chip label={`${formatNumber(video.views)} views`} variant="outlined" size="small" />
                  <Chip label={formatRelativeTime(video.createdAt)} variant="outlined" size="small" />
                  {isOwner ? <Chip label="You uploaded this" color="primary" size="small" /> : null}
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {video?.owner?.fullname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{video?.owner?.username} • {formatNumber(subscriberCount ?? 0)} subscribers
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<FavoriteRoundedIcon />}
                    onClick={() => toggleLikeMutation.mutate()}
                    disabled={toggleLikeMutation.isPending}
                  >
                    Applaud
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      // generate transcript
                      setTranscribeError(null);
                      setTranscript(null);
                      try {
                        setIsTranscribing(true);
                        // fetch video blob (same origin) and send to backend
                        const videoUrl = video.videoFile;
                        const resp = await fetch(videoUrl);
                        if (!resp.ok) throw new Error('Failed to download video');
                        const blob = await resp.blob();
                        const formData = new FormData();
                        // give a filename fallback
                        const filename = (video.title || video._id || 'video') + '.mp4';
                        formData.append('video', new File([blob], filename, { type: blob.type }));
                        const result = await aiApi.transcribeVideo(formData);
                        const payload = result?.data ?? result;
                        setTranscript(payload?.transcript ?? payload?.data?.transcript ?? payload);
                      } catch (err) {
                        console.error('Transcription error', err);
                        setTranscribeError(err?.response?.data?.error ?? err.message ?? 'Transcription failed');
                      } finally {
                        setIsTranscribing(false);
                      }
                    }}
                    disabled={isTranscribing}
                  >
                    {isTranscribing ? 'Generating...' : 'Generate Transcript'}
                  </Button>
                  {!isOwner ? (
                    <Button
                      variant={isSubscribed ? "outlined" : "contained"}
                      color={isSubscribed ? "inherit" : "secondary"}
                      startIcon={<SubscriptionsRoundedIcon />}
                      onClick={() => toggleSubscriptionMutation.mutate()}
                      disabled={toggleSubscriptionMutation.isPending}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                  ) : null}
                  <Button variant="outlined" startIcon={<PlaylistAddRoundedIcon />} disabled>
                    Save
                  </Button>
                </Stack>
              </Stack>
              <Box sx={{ bgcolor: "background.paper", borderRadius: 3, p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {video.description}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Box sx={{ bgcolor: "background.paper", borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Creator insight
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VideocamRoundedIcon fontSize="small" color="primary" />
                  <Typography variant="body2">
                    Duration: {video.duration ? `${video.duration} seconds` : "N/A"}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Video ID: {video._id}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Divider />
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700}>
          Comments
        </Typography>
        {commentError ? <Alert severity="error">{commentError}</Alert> : null}
        <CommentComposer onSubmit={handleCommentSubmit} isSubmitting={addCommentMutation.isPending} />
        {commentsQuery.isPending ? (
          <LoadingScreen message="Loading comments..." />
        ) : comments?.length ? (
          <CommentList comments={comments} />
        ) : (
          <EmptyState title="No comments yet" description="Be the first to share your thoughts." />
        )}
      </Stack>
    </Stack>
  );
};

export default VideoDetailPage;
