import React, { useEffect, useMemo, useState } from 'react';
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
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DynamicTable from '../components/DynamicTable';
// Assuming the following service imports are correct
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import transactionService from '../services/transactionService';
import orderService from '../services/orderService';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loading from '../components/loading';
import KpiCard from '../components/KpiCard';

// --- Custom/Helper Components for better presentation ---

// Reusable KPI Card component
// const KpiCard = ({ title, value, color }) => (
//     <Card sx={{ height: '100%', boxShadow: 3 }}>
//         <CardContent>
//             <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//                 {title}
//             </Typography>
//             <Typography variant="h4" sx={{ color: color || 'inherit' }}>
//                 {value}
//             </Typography>
//         </CardContent>
//     </Card>
// );


// --- Main Dashboard Component ---

function DashboardPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [products, setProducts] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  const [rawSalesTransactions, setRawSalesTransactions] = useState([]);
  const [salesTimeframe, setSalesTimeframe] = useState('daily');
  const [rawTransactionItems, setRawTransactionItems] = useState([]);
  const [topProductsTimeframe, setTopProductsTimeframe] = useState('daily');
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
        setProducts(products);
        setTotalProducts(products.length);
        const lowStockItems = products.filter(p => p.stock < 5);
        setLowStock(lowStockItems.length);

        // Fetch suppliers
        const suppliers = await supplierService.getSupplierList(user);
        setTotalSuppliers(suppliers.data.length);

        // Fetch purchase orders awaiting action
        const orders = await orderService.getOrderListByUser(user);
        setPendingOrdersCount(orders.filter(o => o.status === 'Pending').length);

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
        setRawSalesTransactions(sales.filter(t => t.transaction_type === 'sale'));


        // Top Products (raw items; aggregated client-side per selected timeframe)
        const transactionItems = await transactionService.getAllTransactionItems(user);
        setRawTransactionItems(transactionItems);

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

  // Each timeframe is a rolling window ending today, broken into buckets of the given unit.
  // e.g. "weekly" => the 7 days up to and including today, one bucket per day.
  const TIMEFRAME_CONFIG = {
    daily: { unit: 'hour', count: 24 },
    weekly: { unit: 'day', count: 7 },
    monthly: { unit: 'day', count: 30 },
    quarterly: { unit: 'week', count: 13 },
    yearly: { unit: 'month', count: 12 },
  };

  const getBucketStart = (date, unit) => {
    const d = new Date(date);
    switch (unit) {
      case 'hour':
        d.setMinutes(0, 0, 0);
        return d;
      case 'week':
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay());
        return d;
      case 'month':
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        return d;
      case 'day':
      default:
        d.setHours(0, 0, 0, 0);
        return d;
    }
  };

  const addUnit = (date, unit, amount) => {
    const d = new Date(date);
    switch (unit) {
      case 'hour':
        d.setHours(d.getHours() + amount);
        break;
      case 'week':
        d.setDate(d.getDate() + amount * 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() + amount);
        break;
      case 'day':
      default:
        d.setDate(d.getDate() + amount);
        break;
    }
    return d;
  };

  const formatBucketLabel = (date, unit) => {
    switch (unit) {
      case 'hour':
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return `Week of ${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}`;
      case 'month':
        return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      case 'day':
      default:
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    }
  };

  // Computes the rolling [start, end) window for a timeframe, anchored to today.
  // "all" spans from the earliest of the given transactions through the current month.
  const computeSalesWindow = (timeframe, transactions) => {
    const unit = timeframe === 'all' ? 'month' : (TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG.daily).unit;
    const currentBucketStart = getBucketStart(new Date(), unit);
    const end = addUnit(currentBucketStart, unit, 1);

    let count;
    if (timeframe === 'all') {
      if (transactions.length === 0) {
        count = 1;
      } else {
        const earliest = transactions.reduce(
          (min, t) => (new Date(t.created_at) < min ? new Date(t.created_at) : min),
          new Date(transactions[0].created_at)
        );
        const earliestBucketStart = getBucketStart(earliest, unit);
        count =
          (currentBucketStart.getFullYear() - earliestBucketStart.getFullYear()) * 12 +
          (currentBucketStart.getMonth() - earliestBucketStart.getMonth()) +
          1;
      }
    } else {
      count = (TIMEFRAME_CONFIG[timeframe] || TIMEFRAME_CONFIG.daily).count;
    }

    const start = addUnit(currentBucketStart, unit, -(count - 1));
    return { unit, count, start, end };
  };

  // Sales Chart Data: filters rawSalesTransactions down to the rolling window for the
  // selected timeframe and buckets them, so e.g. "weekly" always reflects the last 7 days
  // relative to today rather than every week ever recorded.
  const salesWindow = useMemo(
    () => computeSalesWindow(salesTimeframe, rawSalesTransactions),
    [salesTimeframe, rawSalesTransactions]
  );

  const salesData = useMemo(() => {
    const { unit, count, start } = salesWindow;
    const buckets = [];
    for (let i = 0; i < count; i++) {
      const bucketStart = addUnit(start, unit, i);
      buckets.push({
        label: formatBucketLabel(bucketStart, unit),
        start: bucketStart,
        end: addUnit(bucketStart, unit, 1),
        total: 0,
      });
    }

    rawSalesTransactions.forEach(t => {
      const tDate = new Date(t.created_at);
      const bucket = buckets.find(b => tDate >= b.start && tDate < b.end);
      if (bucket) {
        bucket.total += t.total_amount;
      }
    });

    return buckets.map(b => ({ date: b.label, total: b.total }));
  }, [rawSalesTransactions, salesWindow]);

  // Top-Selling Products: rawTransactionItems has no date of its own, so each item is
  // matched back to its sale transaction (by transaction_id) to get created_at for filtering.
  const topProductsWindow = useMemo(
    () => computeSalesWindow(topProductsTimeframe, rawSalesTransactions),
    [topProductsTimeframe, rawSalesTransactions]
  );

  const topProductsData = useMemo(() => {
    const { start, end } = topProductsWindow;
    const saleTransactionDates = new Map(
      rawSalesTransactions.map(t => [t.transaction_id, new Date(t.created_at)])
    );

    const soldByProduct = rawTransactionItems.reduce((acc, item) => {
      const tDate = saleTransactionDates.get(item.transaction_id);
      if (!tDate || tDate < start || tDate >= end) return acc;
      acc[item.product_name] = (acc[item.product_name] || 0) + (item.quantity || 0);
      return acc;
    }, {});

    return Object.entries(soldByProduct)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [rawTransactionItems, rawSalesTransactions, topProductsWindow]);

  // Average Order Value across all recorded sales (all-time, not scoped to a timeframe).
  const averageOrderValue = useMemo(() => {
    if (rawSalesTransactions.length === 0) return 0;
    const total = rawSalesTransactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    return total / rawSalesTransactions.length;
  }, [rawSalesTransactions]);

  // Total cost value of everything currently sitting in stock (stock units x cost price).
  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0);
  }, [products]);

  // This week's (last 7 days) sales total vs. the 7 days before that, for a quick
  // momentum indicator on the Sales Today card.
  const weekOverWeekChange = useMemo(() => {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);

    let thisWeekTotal = 0;
    let lastWeekTotal = 0;
    rawSalesTransactions.forEach(t => {
      const tDate = new Date(t.created_at);
      if (tDate >= thisWeekStart && tDate <= now) {
        thisWeekTotal += t.total_amount || 0;
      } else if (tDate >= lastWeekStart && tDate < thisWeekStart) {
        lastWeekTotal += t.total_amount || 0;
      }
    });

    if (lastWeekTotal === 0) return null;
    const percent = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    return {
      direction: percent >= 0 ? 'up' : 'down',
      label: `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% vs last week`,
    };
  }, [rawSalesTransactions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  const handleAddSupplier = () => {
    navigate("/supplier/add");
  };

  const handleGenerateReport = () => {
    const headers = ['ID', 'Total (Rp)', 'Type', 'Date'];
    const rows = recentTransactions.map(t => {
        const formattedTotal = formatCurrency(t.total_amount);
        const formattedDate = new Date(t.created_at).toLocaleDateString('id-ID');
        return [t.transaction_id, formattedTotal, t.transaction_type, formattedDate].join(',');
    });

    const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(',') +
        "\n" +
        rows.join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "recent_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        {/* 0. Greeting Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {getGreeting()}{user?.name ? `, ${user.name}` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's what's happening with your business on{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
          </Typography>
        </Box>

        {/* 1. Row: KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              title="Sales Today"
              value={formatCurrency(salesToday)}
              color="#ff9800"
              to="/report"
              icon={<PointOfSaleIcon />}
              trend={weekOverWeekChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              title="Avg Order Value"
              value={formatCurrency(averageOrderValue)}
              color="#009688"
              to="/report"
              icon={<ReceiptLongIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              title="Total Inventory Value"
              value={formatCurrency(totalInventoryValue)}
              color="#5e35b1"
              to="/warehouse"
              icon={<AccountBalanceWalletIcon />}
              subtitle="Stock on hand, at cost"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              title="Pending Orders"
              value={pendingOrdersCount}
              color="#546e7a"
              to="/order"
              icon={<PendingActionsIcon />}
              subtitle="Purchases awaiting delivery"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard title="Total Products" value={totalProducts} color="#3f51b5" to="/warehouse" icon={<Inventory2Icon />} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard title="Total Suppliers" value={totalSuppliers} color="#4caf50" to="/supplier" icon={<LocalShippingIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard title="Low Stock Items" value={lowStockItems.length} color="#f44336" to="/statistic" icon={<WarningAmberIcon />} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 2. Row: Charts (Sales Over Time and Top Selling Products) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                <Card sx={{ width: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>Sales Over Time</Typography>
                            <FormControl size="small">
                                <Select
                                    value={salesTimeframe}
                                    onChange={(e) => setSalesTimeframe(e.target.value)}
                                >
                                    <MenuItem value="daily">Daily</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                    <MenuItem value="all">All Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <ResponsiveContainer width="100%" height={250}>
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
                <Card sx={{ width: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>Top-Selling Products</Typography>
                            <FormControl size="small">
                                <Select
                                    value={topProductsTimeframe}
                                    onChange={(e) => setTopProductsTimeframe(e.target.value)}
                                >
                                    <MenuItem value="daily">Daily</MenuItem>
                                    <MenuItem value="weekly">Weekly</MenuItem>
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                    <MenuItem value="all">All Time</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
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
        </Box>

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