import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../services/productService";
import transactionService from "../services/transactionService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from "../components/loading";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import orderService from "../services/orderService";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import supplierService from "../services/supplierService";

const AddProductStockPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stockToAdd, setStockToAdd] = useState("");
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [notes, setNotes] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch product details
  useEffect(() => {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await productService.getProductDetail(id, user);
          const fetchedData = response.output_schema || response;
          setProduct(fetchedData);
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to load product details.");
        } finally {
          setLoading(false);
        }
      };
      if (user && user.id) fetchProductData();
  }, [id, user]);


  const handleBackClick = () =>{
        navigate(-1);
    }

  const handleAddStock = async () => {
    try {
      if (!stockToAdd || isNaN(stockToAdd) || stockToAdd <= 0) {
        alert("Please enter a valid stock amount.");
        return;
      }

      setLoading(true);

      const supplierName = await supplierService.getSupplierId(product.supplier_name, user);

      const orderData = {
        product_id: product.id,
        quantity_ordered: parseInt(stockToAdd, 10),
        unit_price: parseFloat(product.price),
        subtotal: parseInt(stockToAdd, 10) * parseFloat(product.price),
        supplier_id: supplierName,
        expected_arrival: transactionDate ? transactionDate.toISOString() : null,
        total_cost: Number(product.price) * Number(stockToAdd),
        status: 'Pending',
        notes: notes,
        user_id: user.id,
      }

      
      // Update product stock
      const newStock = Number(product.stock) + Number(stockToAdd);
      // await productService.editProductDetail(id, {
        //   stock: newStock,
        //   user_id: user.id,
        // });
        
        const order = await orderService.addOrder(orderData);


    //   const transactionData = {
    //     transaction_type_id: '2',
    //     product_id: product.id,
    //     price_per_unit: parseInt(product.price, 10),
    //     quantity: parseInt(product.stock, 10),
    //     reason: 'Restock',
    //     notes: notes,
    //     user_id: user.id,
    // };

    //   // Record transaction
    //   await transactionService.addTransaction(transactionData);

      alert(`Successfully added ${stockToAdd} units to stock.`);
      navigate("/warehouse");
    } catch (err) {
      console.error("Error adding stock:", err);
      setError("Failed to add stock.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error || "Product not found."}</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Button
        variant="contained"
        startIcon= {<ArrowBackIcon/>}
        sx={{ backgroundColor: "#6f42c1" }}
        onClick={handleBackClick}
        >
            Back
        </Button>
      <Typography variant="h5" gutterBottom>
        Add Stock for Product
      </Typography>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle1">
            <strong>Product ID:</strong> {product.id}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Product Name:</strong> {product.name}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Supplier Name:</strong> {product.supplier_name}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Current Stock:</strong> {product.stock}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Purchase Price:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price.toFixed(2))}
          </Typography>
          {product.selling_price && (
            <Typography variant="subtitle1">
              <strong>Selling Price:</strong>{" "}
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.selling_price.toFixed(2))}
            </Typography>
          )}
        </CardContent>
      </Card>

      <TextField
        fullWidth
        label="Stock to Add"
        type="number"
        value={stockToAdd}
        onChange={(e) => setStockToAdd(e.target.value)}
        sx={{ mt: 3 }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Expected Arrival Date"
          value={transactionDate}
          onChange={(newValue) => setTransactionDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth={false} sx={{ mt: 3, width: isMobile ? 300:1000 }} />}
          sx={{mt:3}}
        />
      </LocalizationProvider>

      <TextField
        fullWidth
        label="Notes"
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mt: 3 }}
      />
      

      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#6f42c1", color: "white", px: 4, py: 1.5 }}
          onClick={handleAddStock}
        >
          Add Stock
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default AddProductStockPage;
