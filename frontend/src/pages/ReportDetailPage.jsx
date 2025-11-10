import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import transactionService from "../services/transactionService";
import DynamicTable from "../components/DynamicTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import Loading from "../components/loading";

function ReportDetailPage({ user }) {
  const { id } = useParams();
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

  if (loading) return <Loading />;

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  if (!transactionDetails.length)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No details found for this transaction.</Alert>
      </Container>
    );

  const handleBackClick = () => navigate(-1);

  const transaction = transactionDetails[0];
  const totalAmount = transactionDetails.reduce((sum, item) => sum + item.subtotal, 0);

  const columns = [
    { field: "product_id", label: "Product ID" },
    { field: "product_name", label: "Product Name" },
    { field: "quantity", label: "Quantity" },
    { field: "price_per_unit", label: "Price per Unit", render: (v) => formatCurrency(v) },
    { field: "subtotal", label: "Subtotal", render: (v) => formatCurrency(v) },
    { field: "payment_method", label: "Payment Method" },
  ];

  // 🧾 Print Receipt Function
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleString();

    const receiptHTML = `
      <html>
        <head>
          <title>Transaction Receipt</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
              color: #333;
            }
            h1, h2, h3 {
              text-align: center;
              margin: 0;
            }
            .header {
              margin-bottom: 20px;
            }
            .info {
              margin-bottom: 20px;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #6f42c1;
              color: white;
            }
            tfoot td {
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Transaction Receipt</h1>
            <p>Generated on: ${currentDate}</p>
          </div>

          <div class="info">
            <strong>Transaction ID:</strong> ${transaction.transaction_id}<br>
            <strong>User ID:</strong> ${transaction.user_id}<br>
            <strong>Payment Method:</strong> ${transaction.payment_method}<br>
            <strong>Date:</strong> ${new Date(transaction.created_at).toLocaleString()}<br>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${transactionDetails
                .map(
                  (item) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.price_per_unit)}</td>
                  <td>${formatCurrency(item.subtotal)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3">Total</td>
                <td>${formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <p>Thank you for your purchase!</p>
          </div>

          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Transaction Details
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ color: "#6f42c1", borderColor: "#6f42c1", mr: 1 }}
          >
            Print Receipt
          </Button>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ backgroundColor: "#6f42c1" }}
            onClick={handleBackClick}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Transaction Info */}
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

      {/* Item Table */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Items
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <DynamicTable columns={columns} rows={transactionDetails} />
    </Container>
  );
}

export default ReportDetailPage;
