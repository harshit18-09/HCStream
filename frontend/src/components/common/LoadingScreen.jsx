import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ message = "Loading..." }) => (
  <Box
    sx={{
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    <CircularProgress color="primary" />
    <Typography variant="body1">{message}</Typography>
  </Box>
);

export default LoadingScreen;
