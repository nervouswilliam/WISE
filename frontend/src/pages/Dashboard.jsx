import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DynamicTable from '../components/DynamicTable';
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import transactionService from '../services/transactionService';
import { useNavigate } from "react-router-dom";

function DashboardPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch total products
        const products = await productService.getProductList(user.id);
        setTotalProducts(products.length);

        // Low stock products
        const lowStockItems = products.filter(p => p.stock < 5);
        setLowStock(lowStockItems.length);

        // Fetch total suppliers
        const suppliers = await supplierService.getSupplierList(user);
        setTotalSuppliers(suppliers.data.length);
        console.log(suppliers.data.length);

        // Fetch sales data
        const transactions = await transactionService.getTransactionsByPeriod(user, 'weekly');
        setRecentTransactions(transactions); // last 10 transactions
        const todaySales = transactions.filter(t => {
          const tDate = new Date(t.created_at);
          const today = new Date();
          return tDate.toDateString() === today.toDateString();
        });
        setSalesToday(todaySales.reduce((sum, t) => sum + t.price_per_unit * t.quantity, 0));

        // Placeholder sales chart (sum per day)
        const salesChartData = transactions.map(t => ({
          date: new Date(t.created_at).toLocaleDateString(),
          total: t.price_per_unit * t.quantity
        }));
        setSalesData(salesChartData);

        // Top products
        const topProducts = products
          .map(p => {
            const soldQty = transactions.filter(t => t.product_id === p.id).reduce((sum, t) => sum + t.quantity, 0);
            return { name: p.name, sold: soldQty };
          })
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5);
        setTopProductsData(topProducts);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  const handleAddSupplier = () => {
    navigate("/supplier/add");
  };

  const handleGenerateReport = () => {
    console.log("Generate report");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Total Products</Typography>
              <Typography variant="h4">{totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Total Suppliers</Typography>
              <Typography variant="h4">{totalSuppliers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Sales Today</Typography>
              <Typography variant="h4">Rp {salesToday.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Low Stock Items</Typography>
              <Typography variant="h4" color="error">{lowStock}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales Over Time</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#6f42c1" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top-Selling Products</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#6f42c1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: '#6f42c1' }} startIcon={<AddIcon />} onClick={handleAddProduct}>
          Add Product
        </Button>
        <Button variant="contained" sx={{ backgroundColor: '#6f42c1' }} startIcon={<AddIcon />} onClick={handleAddSupplier}>
          Add Supplier
        </Button>
        <Button variant="contained" color="success" startIcon={<GetAppIcon />} onClick={handleGenerateReport}>
          Generate Report
        </Button>
      </Box>

      {/* Recent Transactions Table */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Recent Transactions</Typography>
          <DynamicTable
            columns={[
              { field: 'id', label: 'ID' },
              { field: 'productName', label: 'Product Name' },
              { field: 'quantity', label: 'Quantity' },
              { field: 'total', label: 'Total (Rp)' },
              { field: 'TransactionType', label: 'Transaction Type' },
              { field: 'date', label: 'Date' }
            ]}
            rows={recentTransactions.map(t => ({
              id: t.transaction_id,
              productName: t.product_name,
              quantity: t.quantity,
              total: (t.price_per_unit * t.quantity).toLocaleString(),
              TransactionType: t.transaction_type,
              date: new Date(t.created_at).toLocaleDateString()
            }))}
          />
        </CardContent>
      </Card>
    </Container>
  );
}

export default DashboardPage;
