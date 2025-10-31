import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import authService from "../services/authService";
import InsightsIcon from '@mui/icons-material/Insights';
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactoryIcon from '@mui/icons-material/Factory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const data = await authService.whoami()
        setUser(data.user_metadata)
      } catch(err){
        console.error("Failed to fetch user:", err)
      }
    };
    fetchUser();
  }, [])

  const drawer = (
    <Box sx={{ width: drawerWidth}}>
      <Typography
        sx={{ 
          m: 1, 
          ml:4,
          fontFamily: "'Baloo Chettan 2', cursive", 
          fontWeight: 700, 
          fontSize: "3rem", 
          lineHeight: 1.2 
        }}
      >
        WISELY
      </Typography>
      <List>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Product */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/statistic">
            <ListItemIcon>
              <InsightsIcon/>
            </ListItemIcon>
            <ListItemText primary="Statistics" />
          </ListItemButton>
        </ListItem>

        {/* Supplier */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/supplier">
            <ListItemIcon>
              <FactoryIcon/>
            </ListItemIcon>
            <ListItemText primary="Supplier" />
          </ListItemButton>
        </ListItem>

        {/* Report */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/report">
            <ListItemIcon>
              <AssessmentIcon/>
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItemButton>
        </ListItem>

        {/* Sale */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/sales">
            <ListItemIcon>
              <PointOfSaleIcon/>
            </ListItemIcon>
            <ListItemText primary="Sale" />
          </ListItemButton>
        </ListItem>

        {/* Warehouse */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/warehouse">
            <ListItemIcon>
              <WarehouseIcon/>
            </ListItemIcon>
            <ListItemText primary="Warehouse" />
          </ListItemButton>
        </ListItem>
  
        {/* Settings */}
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
    "/supplier": "Supplier",
    "/report": "Report",
    "/sale": "Sale",
    "/warehouse": "Warehouse",
    "/settings": "Settings",
    "/product/add": "Add Product",
    "/product/edit/:id": "Edit Product",
    "product/:id": "View Product Detail",
    "/sales": "Point of Sale",
  };

  const title = pageTitles[location.pathname];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor:"#6f42c1"
        }}
      >
        <Toolbar>
          {/* Show menu button on mobile */}
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

          {/* Profile info */}
          <Avatar alt={user?.name} src={user?.imageUrl} sx={{ mr: 2 }} />
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}><LogoutIcon/>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
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
        <Toolbar /> {/* spacer for header */}
        {children}
      </Box>
    </Box>
  );
}
