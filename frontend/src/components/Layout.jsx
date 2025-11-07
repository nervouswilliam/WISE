// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Avatar,
//   Button,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   ListItemIcon,
//   Box,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import authService from "../services/authService";
// import InsightsIcon from '@mui/icons-material/Insights';
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import FactoryIcon from '@mui/icons-material/Factory';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
// import WarehouseIcon from '@mui/icons-material/Warehouse';
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from '@mui/icons-material/Logout';

// const drawerWidth = 240;

// export default function Layout({ children }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try{
//         const data = await authService.whoami()
//         setUser(data.user_metadata)
//       } catch(err){
//         console.error("Failed to fetch user:", err)
//       }
//     };
//     fetchUser();
//   }, [])

//   const drawer = (
//     <Box sx={{ width: drawerWidth}}>
//       <Typography
//         sx={{ 
//           m: 1, 
//           ml:4,
//           fontFamily: "'Baloo Chettan 2', cursive", 
//           fontWeight: 700, 
//           fontSize: "3rem", 
//           lineHeight: 1.2 
//         }}
//       >
//         WISELY
//       </Typography>
//       <List>
//         {/* Dashboard */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/dashboard">
//             <ListItemIcon>
//               <DashboardIcon />
//             </ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>

//         {/* Product */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/statistic">
//             <ListItemIcon>
//               <InsightsIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Statistics" />
//           </ListItemButton>
//         </ListItem>

//         {/* Supplier */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/supplier">
//             <ListItemIcon>
//               <FactoryIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Supplier" />
//           </ListItemButton>
//         </ListItem>

//         {/* Report */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/report">
//             <ListItemIcon>
//               <AssessmentIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Report" />
//           </ListItemButton>
//         </ListItem>

//         {/* Sale */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/sales">
//             <ListItemIcon>
//               <PointOfSaleIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Sale" />
//           </ListItemButton>
//         </ListItem>

//         {/* Warehouse */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/warehouse">
//             <ListItemIcon>
//               <WarehouseIcon/>
//             </ListItemIcon>
//             <ListItemText primary="Warehouse" />
//           </ListItemButton>
//         </ListItem>
  
//         {/* Settings */}
//         <ListItem disablePadding>
//           <ListItemButton component={Link} to="/settings">
//             <ListItemIcon>
//               <SettingsIcon />
//             </ListItemIcon>
//             <ListItemText primary="Settings" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Box>
//   );

//   const pageTitles = {
//     "/dashboard": "Dashboard",
//     "/statistic": "Statistics",
//     "/supplier": "Supplier",
//     "/report": "Report",
//     "/sale": "Sale",
//     "/warehouse": "Warehouse",
//     "/settings": "Settings",
//     "/product/add": "Add Product",
//     "/product/edit/:id": "Edit Product",
//     "product/:id": "View Product Detail",
//     "/sales": "Point of Sale",
//     "/supplier/add": "Add Supplier",
//     "/supplier/edit/:id": "Edit Supplier",
//     "/supplier/:id": "Supplier Detail",
//   };

//   const getPageTitle = (path) => {
//     // Direct match
//     if (pageTitles[path]) return pageTitles[path];

//     // Dynamic routes (pattern matching)
//     if (path.startsWith("/product/edit/")) return "Edit Product";
//     if (path.startsWith("/product/stock-add")) return "Product Stock Add";
//     if (path.startsWith("/product/")) return "Product Detail";
//     if (path.startsWith("/supplier/edit/")) return "Edit Supplier";
//     if (path.startsWith("/supplier/")) return "Supplier Detail";

//     return "Wisely";
//   };

//   const title = getPageTitle(location.pathname);

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Header */}
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//           bgcolor:"#6f42c1"
//         }}
//       >
//         <Toolbar>
//           {/* Show menu button on mobile */}
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>

//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             {title}
//           </Typography>

//           {/* Profile info */}
//           <Avatar alt={user?.name} src={user?.imageUrl} sx={{ mr: 2 }} />
//           <Typography variant="body1" sx={{ mr: 2 }}>
//             {user?.name}
//           </Typography>
//           <Button color="inherit" onClick={handleLogout}><LogoutIcon/>Logout</Button>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar */}
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       >
//         {/* Mobile Drawer */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: "block", sm: "none" },
//             "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>

//         {/* Desktop Drawer */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", sm: "block" },
//             "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       {/* Main content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//         }}
//       >
//         <Toolbar /> {/* spacer for header */}
//         {children}
//       </Box>
//     </Box>
//   );
// }


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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import InsightsIcon from "@mui/icons-material/Insights";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FactoryIcon from "@mui/icons-material/Factory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SettingsIcon from "@mui/icons-material/Settings";
import authService from "../services/authService";
import notificationService from "../services/notificationService";

const drawerWidth = 240;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  const open = Boolean(anchorEl);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await authService.whoami();
        const currentUser = response.user_metadata;
        setUser(currentUser);
        setLoading(true);
        console.log("currentUser:", currentUser);
        const data = await notificationService.getNotifications(currentUser.sub, 5);
        setNotifications(data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/statistic">
            <ListItemIcon>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText primary="Statistics" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/supplier">
            <ListItemIcon>
              <FactoryIcon />
            </ListItemIcon>
            <ListItemText primary="Supplier" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/report">
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/sales">
            <ListItemIcon>
              <PointOfSaleIcon />
            </ListItemIcon>
            <ListItemText primary="Sale" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/warehouse">
            <ListItemIcon>
              <WarehouseIcon />
            </ListItemIcon>
            <ListItemText primary="Warehouse" />
          </ListItemButton>
        </ListItem>

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
    "/supplier/add": "Add Supplier",
    "/supplier/edit/:id": "Edit Supplier",
    "/supplier/:id": "Supplier Detail",
    "/notifications": "Notifications",
  };

  const getPageTitle = (path) => {
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith("/product/edit/")) return "Edit Product";
    if (path.startsWith("/product/stock-add")) return "Product Stock Add";
    if (path.startsWith("/product/")) return "Product Detail";
    if (path.startsWith("/supplier/edit/")) return "Edit Supplier";
    if (path.startsWith("/supplier/")) return "Supplier Detail";
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

          {/* 🔔 Notification Icon */}
          <IconButton color="inherit" onClick={handleNotifClick}>
            <NotificationsIcon />
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
                console.log("notifications:", notifications),
                notifications.map((notif, i) => (
                  <Box key={i} sx={{ mb: 1 }}>
                    <Typography variant="body2">{notif.type}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notif.created_at).toLocaleString()}
                    </Typography>
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
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>

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
    </Box>
  );
}
