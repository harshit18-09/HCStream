import { useMemo } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { APP_NAME } from "../../config";
import { navConfig } from "./navConfig";

const SidebarNav = ({ onNavigate }) => {
  const location = useLocation();

  const activeSegment = useMemo(() => {
    return location.pathname;
  }, [location.pathname]);

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
      <Box sx={{ p: 3 }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} {APP_NAME}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarNav;
