import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Box,
  Popover,
  Divider,
  CircularProgress,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import InsightsIcon from "@mui/icons-material/Insights";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactoryIcon from "@mui/icons-material/Factory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PaidIcon from "@mui/icons-material/Paid";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import authService from "../services/authService";
import notificationService from "../services/notificationService";
import ChatbotWidget from "./ChatbotWidget.jsx";
import LocalShipping from '@mui/icons-material/LocalShipping';
import { useThemeMode } from "../context/ThemeModeContext.jsx";
import { hasRouteAccess } from "../utils/roleAccess.js";

const drawerWidth = 240;

// Team and Settings are handled separately below (Team is gated by isStaff/role directly,
// not the ROLE_ALLOWED_PREFIXES map; Settings is always accessible to everyone).
const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/statistic", label: "Statistics", icon: <InsightsIcon /> },
  { to: "/forecast", label: "Sales Forecast", icon: <TrendingUpIcon /> },
  { to: "/supplier", label: "Supplier", icon: <FactoryIcon /> },
  { to: "/order", label: "Order", icon: <LocalShipping /> },
  { to: "/report", label: "Report", icon: <AssessmentIcon /> },
  { to: "/sales", label: "Sale", icon: <PointOfSaleIcon /> },
  { to: "/warehouse", label: "Warehouse", icon: <WarehouseIcon /> },
  { to: "/customer", label: "Customers", icon: <PeopleIcon /> },
  { to: "/expenses", label: "Expenses", icon: <PaidIcon /> },
];

export default function Layout({ children, user: authUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useThemeMode();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleNotifClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorEl(null);
  };

  const handleNotifItemClick = async (notif) => {
    if (notif.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    try {
      await notificationService.markNotificationAsRead(notif.id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.whoami();
        setUser(data.user_metadata);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Notifications are scoped to the business (authUser.id), same as every other RLS-scoped
  // table in the app - so staff see the same stock/order alerts the owner would, not just
  // whoever happens to be logged in.
  useEffect(() => {
    if (!authUser?.id) return;
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications(authUser.id, 5);
        setNotifications(data.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [authUser?.id]);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Typography
        sx={{
          m: 1,
          ml: 4,
          fontFamily: "'Baloo Chettan 2', cursive",
          fontWeight: 700,
          fontSize: "3rem",
          lineHeight: 1.2,
        }}
      >
        WISELY
      </Typography>
      <List>
        {NAV_ITEMS.filter((item) => hasRouteAccess(authUser?.role, item.to)).map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton component={Link} to={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {(!authUser?.isStaff || authUser?.role === "manager") && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/team">
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Team" />
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/statistic": "Statistics",
    "/forecast": "Sales Forecast",
    "/supplier": "Supplier",
    "/report": "Report",
    "/sale": "Sale",
    "/warehouse": "Warehouse",
    "/settings": "Settings",
    "/product/add": "Add Product",
    "/product/edit/:id": "Edit Product",
    "product/:id": "View Product Detail",
    "/sales": "Point of Sale",
    "/supplier/add": "Add Supplier",
    "/supplier/edit/:id": "Edit Supplier",
    "/supplier/:id": "Supplier Detail",
    "/notifications": "Notifications",
    "/order":"Order",
    "/expenses": "Expenses",
    "/team": "Team",
    "/customer": "Customers",
    "/customer/add": "Add Customer",
  };

  const getPageTitle = (path) => {
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith("/product/edit/")) return "Edit Product";
    if (path.startsWith("/product/stock-add")) return "Product Stock Add";
    if (path.startsWith("/product/")) return "Product Detail";
    if (path.startsWith("/supplier/edit/")) return "Edit Supplier";
    if (path.startsWith("/supplier/")) return "Supplier Detail";
    if (path.startsWith("/customer/edit/")) return "Edit Customer";
    if (path.startsWith("/customer/")) return "Customer Detail";
    return "Wisely";
  };

  const title = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#6f42c1",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Light/Dark mode toggle */}
          <IconButton color="inherit" onClick={toggleMode} title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* 🔔 Notification Icon */}
          <IconButton color="inherit" onClick={handleNotifClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Popover for notifications */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleNotifClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ width: 300, p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Notifications
              </Typography>
              <Divider sx={{ mb: 1 }} />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No new notifications.
                </Typography>
              ) : (
                notifications.map((notif, i) => (
                  <Box key={notif.id ?? i}>
                    <Box
                      onClick={() => handleNotifItemClick(notif)}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        cursor: notif.read ? "default" : "pointer",
                        backgroundColor: notif.read ? "transparent" : "action.hover",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 600 }}>
                        {notif.message || notif.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notif.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                    {i !== notifications.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))
              )}

              <Divider sx={{ my: 1 }} />
              <Button
                fullWidth
                onClick={() => {
                  handleNotifClose();
                  navigate("/notifications");
                }}
              >
                View More
              </Button>
            </Box>
          </Popover>

          {/* Profile info */}
          <Avatar alt={user?.name} src={user?.imageUrl} sx={{ ml: 2, mr: 1 }} />
          <Box sx={{ mr: 2, lineHeight: 1.2 }}>
            <Typography variant="body1">{user?.name}</Typography>
            {authUser?.role && (
              <Typography variant="caption" sx={{ opacity: 0.8, display: "block" }}>
                {authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)}
              </Typography>
            )}
          </Box>

          <Button color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} /> Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <ChatbotWidget />
    </Box>
  );
}
