import { Box, Typography } from "@mui/material";

const EmptyState = ({
  title = "Nothing to show yet",
  description = "Come back later for more content.",
  icon = null,
}) => (
  <Box
    sx={{
      minHeight: "30vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    <Typography variant="body2" sx={{ maxWidth: 400 }}>
      {description}
    </Typography>
  </Box>
);

export default EmptyState;
