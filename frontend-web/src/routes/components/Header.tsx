import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Sidebar from "./Sidebar"; // Sidebar component (created separately)
import { apiService } from "../api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../helper/NotificationProvider";

interface HeaderProps {
  username: string;
  role: string;
  profilePic: string;
}

export default function Header({ username, role, profilePic }: HeaderProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {showNotification} = useNotification();
  const handleLogout = async () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    const response = await apiService.delete("auth/logout");
    const errorCode = response?.error_schema.error_code;
    if(errorCode === "S001"){
      navigate("/login");
      showNotification("Logout Successful", "success")
    } else {
      showNotification(response?.error_schema.error_message || "Logout Failed", "error");
    }
  }

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#7142B0", paddingX: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left: Menu Button & Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                lineHeight: 1,
                fontFamily: "inherit" // This will inherit from your CSS
              }}
            >
              WISELY
            </Typography>
          </Box>

          {/* Right: Profile, Notifications, Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Profile */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={profilePic} sx={{ width: 40, height: 40, border: "2px solid white" }} />
              <Box sx={{ marginLeft: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {username}
                </Typography>
                <Typography variant="caption" color="white">
                  {role}
                </Typography>
              </Box>
            </Box>

            {/* Notifications */}
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Logout */}
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
