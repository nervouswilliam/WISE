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
  Alert,
  Divider, // Added Divider for visual separation
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DynamicTable from '../components/DynamicTable';
// Assuming the following service imports are correct
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import transactionService from '../services/transactionService';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loading from '../components/loading';

// --- Custom/Helper Components for better presentation ---

// Reusable KPI Card component
const KpiCard = ({ title, value, color }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" sx={{ color: color || 'inherit' }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);


// --- Main Dashboard Component ---

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
  const [lowStockItems, setLowStockItems] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const handleClick = (row) => {
      navigate(`/report/${row.id}`);
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products and calculate metrics
        const products = await productService.getProductList(user.id);
        setTotalProducts(products.length);
        const lowStockItems = products.filter(p => p.stock < 5);
        setLowStock(lowStockItems.length);

        // Fetch suppliers
        const suppliers = await supplierService.getSupplierList(user);
        setTotalSuppliers(suppliers.data.length);

        // Fetch transactions
        const transactions = await transactionService.getTransactionsByPeriod(user, 'weekly');

        // Filter and calculate Sales Today
        const today = new Date();
        const todaySales = transactions.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.toDateString() === today.toDateString();
        }).reduce((sum, t) => sum + (t.total_amount || 0), 0);
        setSalesToday(todaySales);

        const sales = await transactionService.getSalesTransactions(user);

        // Sales Chart Data (aggregated by date)
        const salesByDate = sales.filter(t => t.transaction_type === 'sale').reduce((acc, t) => {
            const dateStr = new Date(t.created_at).toLocaleDateString();
            const total = t.total_amount;
            acc[dateStr] = (acc[dateStr] || 0) + total;
            return acc;
        }, {});
        setSalesData(Object.keys(salesByDate).map(date => ({ date, total: salesByDate[date] })));


        // Top Products
        const productSales = await transactionService.getProductSales(user);
        const topProducts = productSales
            .map(ps => ({ name: ps.product_name, sold: ps.total_sold }))
            .slice(0, 5);
        setTopProductsData(topProducts);

        // Recent transactions (e.g., last 10)
        setRecentTransactions(transactions.slice(0, 10));

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please check network and service connectivity.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
  const fetchLowStock = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)

    if (error){
      console.error("Error fetching low stock items:", error);
    } else {
      const lowStock = data.filter(p => p.stock <= p.low_stock);
      setLowStockItems(lowStock);
    }
  };

  fetchLowStock();
}, [user]);


  const handleAddProduct = () => {
    navigate("/product/add");
  };

  const handleAddSupplier = () => {
    navigate("/supplier/add");
  };

  const handleGenerateReport = () => {
    // Implement report generation logic here
    alert("Report generation feature is pending implementation.");
  };

  if (loading) {
    return (<Loading />);
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
      return `Rp ${amount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

        {/* 1. Row: KPI Cards (4 in a row) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Total Products" value={totalProducts} color="#3f51b5" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Total Suppliers" value={totalSuppliers} color="#4caf50" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Sales Today" value={formatCurrency(salesToday)} color="#ff9800" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Low Stock Items" value={lowStockItems.length} color="#f44336" />
            </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 2. Row: Charts (Sales Over Time and Top Selling Products) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={7}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Sales Over Time</Typography>
                        <ResponsiveContainer width={isMobile ? 300 : 700} height={250}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} width={100} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Line type="monotone" dataKey="total" stroke="#6f42c1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={5}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Top-Selling Products</Typography>
                        <ResponsiveContainer width={isMobile ? 300 : 700} height={250}>
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

        <Divider sx={{ my: 3 }} />

        {/* 3. Row: Action Buttons (Add Product, Add Supplier, Generate Report) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#6f42c1' }}
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                fullWidth={false} // Override fullWidth on mobile
            >
                Add Product
            </Button>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#6f42c1' }}
                startIcon={<AddIcon />}
                onClick={handleAddSupplier}
                fullWidth={false}
            >
                Add Supplier
            </Button>
            <Button
                variant="contained"
                color="success"
                startIcon={<GetAppIcon />}
                onClick={handleGenerateReport}
                fullWidth={false}
            >
                Generate Report
            </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 4. Row: Recent Transactions Table */}
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Space between search bar and button
          alignItems: "center",
          width: "100%",
          mb: 2,
          flexDirection: "wrap", // make it responsive on small screens
          gap: 2
        }}
        >
          {/* <Typography variant="h6" gutterBottom>Recent Transactions</Typography> */}
          <DynamicTable
              columns={[
                  { field: 'id', label: 'ID' },
                  { field: 'total', label: 'Total (Rp)' },
                  { field: 'TransactionType', label: 'Type' },
                  { field: 'date', label: 'Date' }
              ]}
              rows={recentTransactions.map(t => ({
                  id: t.transaction_id,
                  // Formatting total using the helper function
                  total: formatCurrency(t.total_amount),
                  TransactionType: t.transaction_type,
                  date: new Date(t.created_at).toLocaleDateString('id-ID')
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
        </Box>
    </Container>
  );
}

export default DashboardPage;