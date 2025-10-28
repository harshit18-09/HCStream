import { Box } from "@mui/material";

const VideoPlayer = ({ src, poster }) => (
  <Box sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "black" }}>
    <video controls width="100%" poster={poster} style={{ display: "block" }}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </Box>
);

export default VideoPlayer;
