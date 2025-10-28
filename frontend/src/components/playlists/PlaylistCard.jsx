import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import QueueMusicRoundedIcon from "@mui/icons-material/QueueMusicRounded";
import { formatRelativeTime } from "../../utils/formatters";

const PlaylistCard = ({ playlist }) => {
  if (!playlist) {
    return null;
  }
  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
      }}
    >
      <CardActionArea component={RouterLink} to={`/playlists/${playlist._id}`}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "common.white",
              }}
            >
              <QueueMusicRoundedIcon />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {playlist.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {playlist.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {playlist.videos?.length ?? 0} videos • Updated {formatRelativeTime(playlist.updatedAt)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PlaylistCard;
