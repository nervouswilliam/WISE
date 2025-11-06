import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DynamicTable from "../components/DynamicTable";
import productService from "../services/productService";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import { supabase } from "../supabaseClient";

function WarehousePage({ user }) {
  const [product, setProduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user_id = user.id;

  const handleGetProductList = async () => {
    try {
      const data = await productService.getProductList(user_id);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product data: ", err);
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

  // Filtered products based on search term
  const filteredProducts = product.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(search) ||
      String(p.id).toLowerCase().includes(search)
    );
  });

  return (
    <>
      {/* Add Product Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Space between search bar and button
          alignItems: "center",
          width: "100%",
          mb: 2,
          flexWrap: "wrap", // make it responsive on small screens
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
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />

        {/* Add Product Button */}
        <Button
          sx={{
            backgroundColor: "#6f42c1",
            color: "white",
            "&:hover": { backgroundColor: "#5a32a3" }
          }}
          onClick={handleAddProducts}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Product
        </Button>
      </Box>

      {/* Dynamic Table */}
      <DynamicTable
        columns={[
          { field: "id", label: "Product Id", sortable: true },
          { field: "name", label: "Name", sortable: true },
          { field: "price", label: "Price", sortable: true },
          { field: "stock", label: "Stock", sortable: true }
        ]}
        rows={filteredProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR"
          }).format(p.price),
          stock: new Intl.NumberFormat("id-ID").format(p.stock)
        }))}
        actions={(row) => (
          <Button
            variant="contained"
            onClick={() => handleClick(row)}
            sx={{ backgroundColor: "#6f42c1" }}
          >
            VIEW
          </Button>
        )}
      />
    </>
  );
}

export default WarehousePage;
