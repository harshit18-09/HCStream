import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { buildErrorMessage } from "../../api/response";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      Object.entries(formState).forEach(([key, value]) => payload.append(key, value));
      if (avatarFile) {
        payload.append("avatar", avatarFile);
      }
      if (coverFile) {
        payload.append("coverImage", coverFile);
      }
      return authApi.register(payload);
    },
    onSuccess: () => {
      setSuccessMessage("Account created successfully. You can now sign in.");
      setTimeout(() => navigate("/auth/login"), 1500);
    },
    onError: (err) => {
      setError(buildErrorMessage(err));
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!avatarFile) {
      setError("Please upload an avatar to continue");
      return;
    }

    registerMutation.mutate();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper elevation={8} sx={{ maxWidth: 560, width: "100%", p: 4, borderRadius: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Join HCStream
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your creator account and start sharing amazing content.
            </Typography>
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="fullname"
              label="Full name"
              value={formState.fullname}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="username"
              label="Username"
              value={formState.username}
              onChange={handleChange}
              required
              fullWidth
            />
          </Stack>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="new-password"
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="outlined" component="label" startIcon={<UploadRoundedIcon />} fullWidth>
              {avatarFile ? avatarFile.name : "Upload avatar *"}
              <input type="file" hidden accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
            </Button>
            <Button variant="outlined" component="label" startIcon={<UploadRoundedIcon />} fullWidth>
              {coverFile ? coverFile.name : "Upload cover (optional)"}
              <input type="file" hidden accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)} />
            </Button>
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<PersonAddRoundedIcon />}
            disabled={registerMutation.isPending}
          >
            Create account
          </Button>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/auth/login">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
