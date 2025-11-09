import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Alert,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../services/orderService";
import Loading from "../components/loading";
import StatusPill from "../components/StatusPill";
import DynamicTable from "../components/DynamicTable";
import productService from "../services/productService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function OrderDetailPage({ user }) {
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderHeader, setOrderHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderDetailsById(user, id);
        const data = response.output_schema || response;

        if (Array.isArray(data) && data.length > 0) {
          setOrderHeader(data[0]);
          setOrderItems(data);
        } else {
          setError("No order details found.");
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  // Handle quantity change
  const handleQuantityChange = (row, value) => {
    const updated = orderItems.map((item) =>
      item.order_item_id === row.order_item_id
        ? { ...item, quantity_received: Number(value) }
        : item
    );
    setOrderItems(updated);
  };

  // Receive all
  const handleReceiveAll = () => {
    const updated = orderItems.map((item) => ({
      ...item,
      quantity_received: item.quantity_ordered,
    }));
    setOrderItems(updated);
  };
  const handleBackClick = () =>{
        navigate(-1);
    }

  // Update order
  const handleUpdate = async () => {
    try {
      const allReceived = orderItems.every(
        (item) => item.quantity_received >= item.quantity_ordered
      );

      const updatedOrder = {
        id: orderHeader.order_id,
        user_id: user.id,
        supplier_id: orderHeader.supplier_id,
        product_id: orderHeader.product_id,
        quantity_ordered: orderHeader.quantity_ordered,
        quantity_received: orderItems[0]?.quantity_received ?? 0,
        unit_price: parseFloat(orderHeader.unit_price),
        subtotal: parseFloat(orderHeader.subtotal),
        expected_arrival: orderHeader.expected_arrival,
        actual_arrival: allReceived ? new Date().toISOString() : null,
        total_cost: parseFloat(orderHeader.total_cost),
        status: allReceived ? "Done" : "Pending",
        notes: orderHeader.notes,
        updated_at: new Date().toISOString(),
      };

      await orderService.updateOrderItems(updatedOrder.id, updatedOrder, user);

      const newStock = Number(orderHeader.stock) + Number(orderItems[0].quantity_received);
      await productService.editProductDetail(orderHeader.product_id, {
          stock: newStock,
          user_id: user.id,
        });
      alert("Order updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order.");
    }
  };

  // Cancel order
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderService.cancelOrder(orderHeader.order_id, user);
      alert("Order cancelled.");
      window.location.reload();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!orderHeader) return null;

  // Disable controls if status is Done or Cancelled
  const isDisabled =
    orderHeader.status === "Done" || orderHeader.status === "Cancelled";

  // Define table columns
  const columns = [
    { field: "product_name", label: "Product Name", sortable: true },
    { field: "category_name", label: "Category", sortable: true },
    { field: "quantity_ordered", label: "Qty Ordered", sortable: true },
    {
      field: "quantity_received",
      label: "Qty Received",
      render: (value, row) => (
        <TextField
          type="number"
          value={value ?? ""}
          onChange={(e) => handleQuantityChange(row, e.target.value)}
          size="small"
          sx={{ width: 80 }}
          inputProps={{ min: 0 }}
          disabled={isDisabled}
        />
      ),
    },
    { field: "unit_price", label: "Unit Price", sortable: true },
    { field: "subtotal", label: "Subtotal", sortable: true },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Button
        variant="contained"
        startIcon= {<ArrowBackIcon/>}
        sx={{ backgroundColor: "#6f42c1" }}
        onClick={handleBackClick}
        >
            Back
        </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Supplier:</strong> {orderHeader.supplier_name}
            </Typography>
            <Typography>
              <strong>Status:</strong>{" "}
              <StatusPill status={orderHeader.status} />
            </Typography>
            <Typography>
              <strong>Expected Arrival:</strong>{" "}
              {orderHeader.expected_arrival || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Actual Arrival:</strong>{" "}
              {orderHeader.actual_arrival || "—"}
            </Typography>
            <Typography>
              <strong>Created At:</strong>{" "}
              {new Date(orderHeader.created_at).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <DynamicTable
        columns={columns}
        rows={orderItems}
        rowsPerPageOptions={[5, 10]}
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          color="success"
          onClick={handleReceiveAll}
          disabled={isDisabled}
        >
          Receive All
        </Button>

        <Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6f42c1", mr: 1 }}
            onClick={handleUpdate}
            disabled={isDisabled}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            disabled={isDisabled}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default OrderDetailPage;
