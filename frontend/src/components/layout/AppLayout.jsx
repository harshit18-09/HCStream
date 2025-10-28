import { useState } from "react";
import { Box, Drawer, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import TopBar from "./TopBar";

const drawerWidth = 260;

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <TopBar
        onMenuToggle={handleDrawerToggle}
        onSearchChange={handleSearchChange}
        drawerWidth={drawerWidth}
      />
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "background.paper",
          },
        }}
      >
        <SidebarNav onNavigate={handleDrawerToggle} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "background.paper",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      >
        <SidebarNav />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        <Toolbar />
        <Outlet context={{ searchTerm }} />
      </Box>
    </Box>
  );
};

export default AppLayout;
