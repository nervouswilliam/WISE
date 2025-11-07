import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import transactionService from "../services/transactionService";
import DynamicTable from "../components/DynamicTable";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ReportDetailPage({ user }) {
  const { id } = useParams(); // transaction_id from URL
  const navigate = useNavigate();
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    if (typeof value !== "number") return value;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await transactionService.getTransactionItemsById(user, id);
        const data = response.output_schema || response;
        setTransactionDetails(data);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [id, user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!transactionDetails.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No details found for this transaction.</Alert>
      </Container>
    );
  }

  const handleBackClick = () =>{
        navigate(-1);
    }

  const transaction = transactionDetails[0]; // all rows share same transaction_id
  const totalAmount = transactionDetails.reduce((sum, item) => sum + item.subtotal, 0);

  const columns = [
    { field: "product_id", label: "Product ID" },
    { field: "product_name", label: "Product Name" },
    { field: "quantity", label: "Quantity" },
    { field: "price_per_unit", label: "Price per Unit", render: (value) => formatCurrency(value) },
    { field: "subtotal", label: "Subtotal", render: (value) => formatCurrency(value) },
    { field: "payment_method", label: "Payment Method" },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Transaction Details
        </Typography>
        <Button
        variant="contained"
        startIcon= {<ArrowBackIcon/>}
        sx={{ backgroundColor: "#6f42c1" }}
        onClick={handleBackClick}
        >
            Back
        </Button>
      </Box>

      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><strong>Transaction ID:</strong> {transaction.transaction_id}</Typography>
              <Typography><strong>User ID:</strong> {transaction.user_id}</Typography>
              <Typography><strong>Payment Method:</strong> {transaction.payment_method}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography><strong>Date:</strong> {new Date(transaction.created_at).toLocaleString()}</Typography>
              <Typography><strong>Total Amount:</strong> {formatCurrency(totalAmount)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Items
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <DynamicTable
        columns={columns}
        rows={transactionDetails}
      />
    </Container>
  );
}

export default ReportDetailPage;
