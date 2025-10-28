import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { formatRelativeTime } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";

const CommentItem = ({ comment, onEdit, onDelete }) => {
  const { user } = useAuth();
  const owner = comment?.owner ?? comment?.user;
  const canManage = user?._id && owner?._id && user._id === owner._id;

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
      <Avatar src={owner?.avatar} alt={owner?.fullname}>
        {owner?.fullname?.[0]?.toUpperCase() ?? "U"}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2">{owner?.fullname ?? owner?.username ?? "User"}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatRelativeTime(comment?.createdAt)}
            </Typography>
          </Box>
          {canManage ? (
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => onEdit?.(comment)}>
                <EditRoundedIcon fontSize="inherit" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete?.(comment)}>
                <DeleteRoundedIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          ) : null}
        </Stack>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {comment?.content}
        </Typography>
      </Box>
    </Stack>
  );
};

export default CommentItem;
