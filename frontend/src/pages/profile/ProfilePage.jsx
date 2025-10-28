import { Stack, Paper, Typography, Avatar, Button } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Avatar src={user.avatar} alt={user.fullname} sx={{ width: 96, height: 96 }}>
            {user.fullname?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {user.fullname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => navigate("/settings")}>Edit profile</Button>
          </Stack>
        </Stack>
      </Paper>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Account information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          User ID: {user._id}
        </Typography>
      </Paper>
    </Stack>
  );
};

export default ProfilePage;
