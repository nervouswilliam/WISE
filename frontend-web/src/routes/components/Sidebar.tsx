import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupplierIcon from "@mui/icons-material/Factory";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReportIcon from "@mui/icons-material/Receipt";
import SaleIcon from "@mui/icons-material/PointOfSale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SettingsIcon from "@mui/icons-material/Settings";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const jelajahItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    
  ];
  const inventoryItems = [
    { text: "Produk", icon: <InventoryIcon />, path: "/product" },
    { text: "Supplier", icon: <SupplierIcon />, path: "/supplier" },
    { text: "Report", icon: <ReportIcon />, path: "/report" },
  ];
  const inputDataItems = [
    { text: "Penjualan", icon: <SaleIcon />, path: "/sales" },
    { text: "Warehouse", icon: <WarehouseIcon />, path: "/warehouse" },
  ];
  const settingItems = [
    { text: "Preferensi", icon: <SettingsIcon />, path: "/setting" },
  ];

  return (
    <Drawer open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
      <Box
          sx={{
            height: 64,
            backgroundColor: "#7142B0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
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
        <Divider/>
        <List>
          {jelajahItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path} sx={{ textDecoration: "none" }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {inventoryItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path} sx={{ textDecoration: "none" }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {inputDataItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path} sx={{ textDecoration: "none" }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {settingItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.path} sx={{ textDecoration: "none" }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
