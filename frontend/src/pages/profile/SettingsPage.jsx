import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import { authApi } from "../../api/auth";
import { buildErrorMessage } from "../../api/response";
import { useAuth } from "../../hooks/useAuth";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullname: user?.fullname ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
  });
  const [passwordForm, setPasswordForm] = useState({ oldpassword: "", newpassword: "" });
  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const updateProfileMutation = useMutation({
    mutationFn: () => authApi.updateAccount(profileForm),
    onSuccess: () => {
      updateUser(profileForm);
      setProfileMessage({ type: "success", text: "Profile updated" });
    },
    onError: (error) => {
      setProfileMessage({ type: "error", text: buildErrorMessage(error) });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => authApi.changePassword(passwordForm),
    onSuccess: () => {
      setPasswordMessage({ type: "success", text: "Password changed" });
      setPasswordForm({ oldpassword: "", newpassword: "" });
    },
    onError: (error) => {
      setPasswordMessage({ type: "error", text: buildErrorMessage(error) });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: () => authApi.updateAvatar(avatarFile),
    onSuccess: (data) => {
      const payload = data?.data ?? data;
      updateUser(payload);
      setUploadMessage({ type: "success", text: "Avatar updated" });
      setAvatarFile(null);
    },
    onError: (error) => {
      setUploadMessage({ type: "error", text: buildErrorMessage(error) });
    },
  });

  const updateCoverMutation = useMutation({
    mutationFn: () => authApi.updateCoverImage(coverFile),
    onSuccess: (data) => {
      const payload = data?.data ?? data;
      updateUser(payload);
      setUploadMessage({ type: "success", text: "Cover image updated" });
      setCoverFile(null);
    },
    onError: (error) => {
      setUploadMessage({ type: "error", text: buildErrorMessage(error) });
    },
  });

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setProfileMessage(null);
    updateProfileMutation.mutate();
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordMessage(null);
    changePasswordMutation.mutate();
  };

  const handleAvatarUpload = () => {
    if (!avatarFile) {
      setUploadMessage({ type: "error", text: "Select an avatar first" });
      return;
    }
    updateAvatarMutation.mutate();
  };

  const handleCoverUpload = () => {
    if (!coverFile) {
      setUploadMessage({ type: "error", text: "Select a cover image first" });
      return;
    }
    updateCoverMutation.mutate();
  };

  return (
    <Stack spacing={4}>
      <Paper component="form" onSubmit={handleProfileSubmit} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Profile details
          </Typography>
          {profileMessage ? <Alert severity={profileMessage.type}>{profileMessage.text}</Alert> : null}
          <TextField
            name="fullname"
            label="Full name"
            value={profileForm.fullname}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, fullname: event.target.value }))}
            fullWidth
          />
          <TextField
            name="username"
            label="Username"
            value={profileForm.username}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, username: event.target.value }))}
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={profileForm.email}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
            type="email"
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} disabled={updateProfileMutation.isPending}>
            Save changes
          </Button>
        </Stack>
      </Paper>

      <Paper component="form" onSubmit={handlePasswordSubmit} sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Change password
          </Typography>
          {passwordMessage ? <Alert severity={passwordMessage.type}>{passwordMessage.text}</Alert> : null}
          <TextField
            name="oldpassword"
            label="Current password"
            type="password"
            value={passwordForm.oldpassword}
            onChange={(event) => setPasswordForm((prev) => ({ ...prev, oldpassword: event.target.value }))}
            required
            fullWidth
          />
          <TextField
            name="newpassword"
            label="New password"
            type="password"
            value={passwordForm.newpassword}
            onChange={(event) => setPasswordForm((prev) => ({ ...prev, newpassword: event.target.value }))}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" startIcon={<LockResetRoundedIcon />} disabled={changePasswordMutation.isPending}>
            Update password
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={700}>
            Media assets
          </Typography>
          {uploadMessage ? <Alert severity={uploadMessage.type}>{uploadMessage.text}</Alert> : null}
          <Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              <Button variant="outlined" component="label" startIcon={<UploadRoundedIcon />} fullWidth>
                {avatarFile ? avatarFile.name : "Select avatar"}
                <input type="file" hidden accept="image/*" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
              </Button>
              <Button variant="contained" onClick={handleAvatarUpload} disabled={updateAvatarMutation.isPending}>
                Upload avatar
              </Button>
            </Stack>
          </Box>
          <Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
              <Button variant="outlined" component="label" startIcon={<UploadRoundedIcon />} fullWidth>
                {coverFile ? coverFile.name : "Select cover image"}
                <input type="file" hidden accept="image/*" onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)} />
              </Button>
              <Button variant="contained" onClick={handleCoverUpload} disabled={updateCoverMutation.isPending}>
                Upload cover
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default SettingsPage;
