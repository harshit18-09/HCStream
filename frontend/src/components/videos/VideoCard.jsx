import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { formatDuration, formatNumber, formatRelativeTime } from "../../utils/formatters";

const VideoCard = ({ video }) => {
  if (!video) {
    return null;
  }
  const {
    _id,
    title,
    description,
    thumbnail,
    duration,
    views,
    createdAt,
    owner,
  } = video;

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea component={RouterLink} to={`/videos/${_id}`} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            position: "relative",
            pt: "56.25%",
            bgcolor: "grey.900",
            backgroundImage: thumbnail ? `url(${thumbnail})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: "rgba(15,15,15,0.7)",
              borderRadius: 2,
              px: 1,
              py: 0.25,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <PlayArrowRoundedIcon fontSize="inherit" />
            {formatDuration(duration)}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar src={owner?.avatar} alt={owner?.fullname} sx={{ width: 40, height: 40 }}>
              {owner?.fullname?.[0]?.toUpperCase() ?? "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                {owner?.fullname ?? owner?.username ?? "Unknown"} • {formatNumber(views)} views • {formatRelativeTime(createdAt)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;
