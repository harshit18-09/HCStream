import { Grid } from "@mui/material";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => (
  <Grid container spacing={3}>
    {videos?.map((video) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
        <VideoCard video={video} />
      </Grid>
    ))}
  </Grid>
);

export default VideoGrid;
