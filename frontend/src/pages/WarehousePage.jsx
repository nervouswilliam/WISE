import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ClearIcon from "@mui/icons-material/Clear";
import DynamicTable from "../components/DynamicTable";
import productService from "../services/productService";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { supabase } from "../supabaseClient";
import Loading from "../components/loading";

const VIEW_MODE_STORAGE_KEY = "warehouseViewMode";
const PRIMARY_COLOR = "#6f42c1";

const STOCK_STATUS_OPTIONS = [
  { value: "all", label: "All Stock Levels" },
  { value: "in", label: "In Stock" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out of Stock" },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount || 0);

// Out of stock takes priority over low stock even if low_stock threshold is 0.
const getStockStatus = (p) => {
  if ((p.stock || 0) <= 0) return "out";
  if (p.low_stock != null && p.stock <= p.low_stock) return "low";
  return "in";
};

function WarehousePage({ user }) {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStatusFilter, setStockStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem(VIEW_MODE_STORAGE_KEY) || "table"
  );
  const navigate = useNavigate();
  const user_id = user.id;

  const handleGetProductList = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductList(user_id);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product data: ", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    handleGetProductList();
  }, []);

  const handleClick = (row) => {
    navigate(`/product/${row.id}`);
  };

  const handleAddProducts = () => {
    navigate(`/product/add`);
  };

  const handleViewModeChange = (e, newMode) => {
    if (!newMode) return; // ignore re-clicking the already-active button
    setViewMode(newMode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, newMode);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStockStatusFilter("all");
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  const categories = [...new Set(product.map((p) => p.category_name).filter(Boolean))].sort();

  const hasActiveFilters = searchTerm !== "" || categoryFilter !== "all" || stockStatusFilter !== "all";

  // Filtered products based on search term, category, and stock status
  const filteredProducts = product.filter((p) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(search) ||
      String(p.id).toLowerCase().includes(search);
    const matchesCategory = categoryFilter === "all" || p.category_name === categoryFilter;
    const matchesStock = stockStatusFilter === "all" || getStockStatus(p) === stockStatusFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <>
      {/* Toolbar: search, filters, view toggle, add product */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 2,
          flexWrap: "wrap",
          gap: 2
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search by product name or ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 200, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />

        {/* Category filter */}
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Stock status filter */}
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Stock Status</InputLabel>
          <Select
            value={stockStatusFilter}
            label="Stock Status"
            onChange={(e) => setStockStatusFilter(e.target.value)}
          >
            {STOCK_STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button size="small" startIcon={<ClearIcon />} onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", ml: "auto" }}>
          {/* Table / Card view toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="table" aria-label="table view">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="cards" aria-label="card view">
              <GridViewIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Add Product Button */}
          <Button
            sx={{
              backgroundColor: PRIMARY_COLOR,
              color: "white",
              "&:hover": { backgroundColor: "#5a32a3" }
            }}
            onClick={handleAddProducts}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Product
          </Button>
        </Box>
      </Box>

      {filteredProducts.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 6 }}>
          No products match your filters.
        </Typography>
      ) : viewMode === "table" ? (
        <DynamicTable
          columns={[
            { field: "id", label: "Product Id", sortable: true },
            { field: "name", label: "Name", sortable: true },
            { field: "category", label: "Category", sortable: true },
            { field: "price", label: "Price", sortable: true },
            { field: "stock", label: "Stock", sortable: true }
          ]}
          rows={filteredProducts.map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category_name || "—",
            price: formatCurrency(p.price),
            stock: new Intl.NumberFormat("id-ID").format(p.stock)
          }))}
          actions={(row) => (
            <Button
              variant="contained"
              onClick={() => handleClick(row)}
              sx={{ backgroundColor: PRIMARY_COLOR }}
            >
              VIEW
            </Button>
          )}
        />
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((p) => {
            const stockStatus = getStockStatus(p);
            return (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                  }}
                  onClick={() => handleClick(p)}
                >
                  <Box
                    sx={{
                      height: 160,
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {p.image_url ? (
                      <Box
                        component="img"
                        src={p.image_url}
                        alt={p.name}
                        sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Inventory2Icon sx={{ fontSize: 48, color: "grey.400" }} />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap title={p.name}>
                      {p.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      ID: {p.id}{p.category_name ? ` · ${p.category_name}` : ''}
                    </Typography>
                    <Typography variant="h6" sx={{ color: PRIMARY_COLOR, mt: 0.5, mb: 1 }}>
                      {formatCurrency(p.price)}
                    </Typography>
                    <Chip
                      size="small"
                      label={stockStatus === "out" ? "Out of Stock" : `Stock: ${p.stock}`}
                      color={stockStatus === "out" ? "error" : stockStatus === "low" ? "warning" : "default"}
                      variant={stockStatus === "in" ? "outlined" : "filled"}
                    />
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ backgroundColor: PRIMARY_COLOR }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(p);
                      }}
                    >
                      VIEW
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
}

export default WarehousePage;
