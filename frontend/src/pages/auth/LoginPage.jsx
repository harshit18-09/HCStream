import { useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
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
import { useMutation } from "@tanstack/react-query";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { authApi } from "../../api/auth";
import { buildErrorMessage } from "../../api/response";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [formState, setFormState] = useState({ identifier: "", password: "" });
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from?.pathname ?? "/";

  const loginMutation = useMutation({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data) => {
      const payload = data ?? {};
      const user = payload.user ?? payload;
      setAuth({ user, accessToken: payload.accessToken, refreshToken: payload.refreshToken });
      navigate(redirectTo, { replace: true });
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
    const payload = formState.identifier.includes("@")
      ? { email: formState.identifier, password: formState.password }
      : { username: formState.identifier, password: formState.password };
    loginMutation.mutate(payload);
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
      <Paper elevation={8} sx={{ maxWidth: 420, width: "100%", p: 4, borderRadius: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue creating and streaming on HCStream.
            </Typography>
          </Box>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            name="identifier"
            label="Email or Username"
            value={formState.identifier}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={formState.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<LoginRoundedIcon />}
            disabled={loginMutation.isPending}
          >
            Sign In
          </Button>
          <Typography variant="body2" color="text.secondary">
            New to HCStream?{" "}
            <Link component={RouterLink} to="/auth/register">
              Create an account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
