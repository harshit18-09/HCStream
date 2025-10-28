import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  ToggleButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { buildErrorMessage } from "../../api/response";
import { useThemeMode } from "../../providers/ThemeModeProvider";

const TopBar = ({ onMenuToggle, onSearchChange, drawerWidth = 0 }) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { mode, toggleMode } = useThemeMode();

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
      sx={(theme) => ({
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onMenuToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Tooltip title={user?.fullname ?? "Account"}>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              {user?.avatar ? (
                <Avatar alt={user.fullname} src={user.avatar} />
              ) : (
                <Avatar>{user?.fullname?.[0]?.toUpperCase() ?? "U"}</Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Box>
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
        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} placement="bottom">
          <ToggleButton
            value="theme-toggle"
            selected={mode === "dark"}
            onChange={toggleMode}
            size="small"
            sx={{
              borderRadius: 999,
              minWidth: 0,
              px: 1.25,
              borderColor: "divider",
              color: "text.secondary",
              bgcolor: "background.paper",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                borderColor: "primary.main",
                color: "primary.contrastText",
              },
              "&:hover": {
                bgcolor: "action.hover",
              },
              "&.Mui-selected:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {mode === "dark" ? (
              <LightModeRoundedIcon fontSize="small" />
            ) : (
              <DarkModeRoundedIcon fontSize="small" />
            )}
          </ToggleButton>
        </Tooltip>
        <Button
          onClick={handleLogout}
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<LogoutRoundedIcon fontSize="small" />}
          sx={{ display: { xs: "none", md: "inline-flex" } }}
          disabled={logoutMutation.isPending}
        >
          Sign out
        </Button>
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
