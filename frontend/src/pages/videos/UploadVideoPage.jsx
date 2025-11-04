import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { useMutation } from "@tanstack/react-query";
import { videoApi } from "../../api/video";
import { aiApi } from "../../api/ai";
import { buildErrorMessage } from "../../api/response";

const UploadVideoPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState(null);

  const publishMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("title", formState.title);
      formData.append("description", formState.description);
      if (formState.duration) {
        formData.append("duration", formState.duration);
      }
      if (videoFile) {
        formData.append("videoFile", videoFile);
      }
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      return videoApi.publishVideo(formData);
    },
    onSuccess: (data) => {
      const payload = data?.data ?? data;
      navigate(`/videos/${payload?._id ?? payload?.video?._id ?? ""}`);
    },
    onError: (err) => {
      setError(buildErrorMessage(err));
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    if (!videoFile || !thumbnailFile) {
      setError("Video file and thumbnail are required");
      return;
    }
    publishMutation.mutate();
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Upload a new video
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your latest creation with the HCStream community.
          </Typography>
        </Box>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          name="title"
          label="Title"
          value={formState.title}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="description"
          label="Description"
          value={formState.description}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={4}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            name="reference"
            label="Reference text (optional)"
            value={formState.reference ?? ''}
            onChange={(e) => setFormState(prev => ({ ...prev, reference: e.target.value }))}
            fullWidth
            placeholder="Paste a brief description or keywords to auto-suggest title/description"
          />
          <Button
            variant="outlined"
            onClick={async () => {
              setSuggestError(null);
              setIsSuggesting(true);
              try {
                const formData = new FormData();
                if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
                if (formState.reference) formData.append('reference', formState.reference);
                const resp = await aiApi.suggest(formData);
                const payload = resp?.data ?? resp;
                if (payload?.titleSuggestion) {
                  setFormState(prev => ({ ...prev, title: payload.titleSuggestion }));
                }
                if (payload?.descriptionSuggestion) {
                  setFormState(prev => ({ ...prev, description: payload.descriptionSuggestion }));
                }
              } catch (err) {
                console.error('Suggest error', err, err?.response?.data);
                const serverData = err?.response?.data;
                setSuggestError(serverData ? (typeof serverData === 'string' ? serverData : JSON.stringify(serverData)) : (err.message ?? 'Suggestion failed'));
              } finally {
                setIsSuggesting(false);
              }
            }}
            disabled={isSuggesting}
          >
            {isSuggesting ? 'Suggesting...' : 'Auto-suggest'}
          </Button>
        </Stack>
        {suggestError ? <Alert severity="error">{suggestError}</Alert> : null}
        <TextField
          name="duration"
          label="Duration (seconds)"
          value={formState.duration}
          onChange={handleChange}
          type="number"
          fullWidth
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" component="label" startIcon={<CloudUploadRoundedIcon />} fullWidth>
            {videoFile ? videoFile.name : "Select video file *"}
            <input type="file" hidden accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)} />
          </Button>
          <Button variant="outlined" component="label" startIcon={<CloudUploadRoundedIcon />} fullWidth>
            {thumbnailFile ? thumbnailFile.name : "Select thumbnail *"}
            <input type="file" hidden accept="image/*" onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)} />
          </Button>
        </Stack>
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<CloudUploadRoundedIcon />}
          disabled={publishMutation.isPending}
        >
          Publish
        </Button>
      </Stack>
    </Paper>
  );
};

export default UploadVideoPage;
