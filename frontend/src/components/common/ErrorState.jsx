import { Box, Button, Typography } from "@mui/material";

const ErrorState = ({
  title = "Something went wrong",
  description = "Please try again",
  actionLabel = "Retry",
  onRetry,
}) => (
  <Box
    sx={{
      minHeight: "40vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      textAlign: "center",
      color: "text.secondary",
    }}
  >
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
    <Typography variant="body2" sx={{ maxWidth: 420 }}>
      {description}
    </Typography>
    {onRetry ? (
      <Button variant="contained" color="primary" onClick={onRetry}>
        {actionLabel}
      </Button>
    ) : null}
  </Box>
);

export default ErrorState;
