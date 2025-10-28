import { Button, Typography, Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        HCStream 🎬
      </Typography>
      <Button variant="contained" color="primary">
        MUI Working 🚀
      </Button>
    </Box>
  );
}

export default App;
