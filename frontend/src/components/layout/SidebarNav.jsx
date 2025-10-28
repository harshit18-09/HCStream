import { useMemo } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useMutation } from "@tanstack/react-query";
import { APP_NAME } from "../../config";
import { navConfig } from "./navConfig";
import { authApi } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { buildErrorMessage } from "../../api/response";

const SidebarNav = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

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

  const activeSegment = useMemo(() => {
    return location.pathname;
  }, [location.pathname]);

  const handleSignOut = () => {
    logoutMutation.mutate();
  };

  return (
    <Box sx={{ width: 260, display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">
          {APP_NAME}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Creator Studio
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ flex: 1 }}>
        {navConfig.map((item) => {
          const isActive = activeSegment === item.to || (item.to !== "/" && activeSegment.startsWith(item.to));
          const IconComponent = item.icon;
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={isActive}
              onClick={onNavigate}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                {IconComponent ? <IconComponent fontSize="small" /> : null}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSignOut}
          startIcon={<LogoutRoundedIcon fontSize="small" />}
          disabled={logoutMutation.isPending}
        >
          Sign out
        </Button>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} {APP_NAME}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarNav;
