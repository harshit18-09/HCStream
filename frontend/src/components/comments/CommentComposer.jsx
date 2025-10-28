import { useState } from "react";
import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useAuth } from "../../hooks/useAuth";

const CommentComposer = ({ onSubmit, isSubmitting = false }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }
    onSubmit?.(content.trim(), () => setContent(""));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar src={user?.avatar} alt={user?.fullname}>
          {user?.fullname?.[0]?.toUpperCase() ?? "U"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <TextField
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts..."
            fullWidth
            multiline
            minRows={2}
          />
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button type="submit" variant="contained" endIcon={<SendRoundedIcon />} disabled={isSubmitting || !content.trim()}>
              Comment
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CommentComposer;
