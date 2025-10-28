import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { buildErrorMessage } from "../../api/response";

const TopBar = ({ onMenuToggle, onSearchChange }) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      navigate("/auth/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed", buildErrorMessage(error));
      clearAuth();
      navigate("/auth/login", { replace: true });
    },
  });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logoutMutation.mutate();
  };

  const handleProfileNavigate = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettingsNavigate = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuToggle}
          sx={{ display: { md: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1, maxWidth: 560, width: "100%" }}>
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search videos, creators, playlists..."
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Tooltip title={user?.fullname ?? "Account"}>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            {user?.avatar ? (
              <Avatar alt={user.fullname} src={user.avatar} />
            ) : (
              <Avatar>{user?.fullname?.[0]?.toUpperCase() ?? "U"}</Avatar>
            )}
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2">{user?.fullname}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <MenuItem onClick={handleProfileNavigate}>
            <AccountCircleRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleSettingsNavigate}>
            <SettingsRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
            <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
