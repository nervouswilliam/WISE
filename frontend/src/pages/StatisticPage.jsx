import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Box,
  LinearProgress,
  useMediaQuery,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie, 
  Tooltip as PieTooltip,
  Legend,
  Cell,

} from "recharts";
import { useTheme } from "@mui/material/styles";
import transactionService from "../services/transactionService";
import productService from "../services/productService";
import orderService from "../services/orderService";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../components/DynamicTable";
import Loading from "../components/loading";
import KpiCard from "../components/KpiCard";
import { forecastNextDays } from "../utils/forecast";

function StatisticPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [purchaseTrend, setPurchaseTrend] = useState([]);
  const [grossMargin, setGrossMargin] = useState(null);
  const [daysOfStock, setDaysOfStock] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Quick preview for the forecast teaser card: projects the next 7 days off the same
  // 7-day sales trend already fetched, without re-fetching everything the dedicated
  // Sales Forecast page needs.
  const forecastPreview = useMemo(() => {
    if (!salesTrend || salesTrend.length === 0) return 0;
    const { predictions } = forecastNextDays(salesTrend.map((d) => d.total), 7);
    return predictions.reduce((a, b) => a + b, 0);
  }, [salesTrend]);

  const handleClick = (row) => {
      navigate(`/product/stock-add/${row.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          // Rolling 7-day window: the 6 days before today through the end of today.
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const windowStart = new Date(todayStart);
          windowStart.setDate(windowStart.getDate() - 6);
          const windowEnd = new Date(todayStart);
          windowEnd.setDate(windowEnd.getDate() + 1);

          const transactions = await transactionService.getSalesTransactions(user);

          // Pre-fill all 7 days so the trend line doesn't skip days with no sales.
          const salesByDate = {};
          for (let i = 0; i < 7; i++) {
            const bucketDate = new Date(windowStart);
            bucketDate.setDate(bucketDate.getDate() + i);
            salesByDate[bucketDate.toLocaleDateString()] = 0;
          }
          transactions.forEach((t) => {
            const tDate = new Date(t.created_at);
            if (tDate >= windowStart && tDate < windowEnd) {
              const dateStr = tDate.toLocaleDateString();
              salesByDate[dateStr] = (salesByDate[dateStr] || 0) + t.total_amount;
            }
          });
          setSalesTrend(Object.keys(salesByDate).map((date) => ({ date, total: salesByDate[date] })));

          // Top 5 products, category revenue, gross margin, and inventory turnover all key
          // off the same raw line items within the 7-day window. Items have no date of
          // their own, so each is matched back to its sale transaction's created_at
          // (via transaction_id) to filter by date.
          const transactionItems = await transactionService.getAllTransactionItems(user);
          const saleTransactionDates = new Map(
            transactions.map((t) => [t.transaction_id, new Date(t.created_at)])
          );

          const allProducts = await productService.getProductList(user.id);
          const costByProductId = new Map(allProducts.map((p) => [p.id, p.price]));
          const categoryByProductId = new Map(allProducts.map((p) => [p.id, p.category_name]));
          const totalStockUnits = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);

          const revenueByProduct = {};
          const revenueByCategory = {};
          let totalQuantitySoldLast7Days = 0;
          let totalCogsLast7Days = 0;

          transactionItems.forEach((item) => {
            const tDate = saleTransactionDates.get(item.transaction_id);
            if (!tDate || tDate < windowStart || tDate >= windowEnd) return;

            const quantity = item.quantity || 0;
            const subtotal = item.subtotal || 0;

            revenueByProduct[item.product_name] = (revenueByProduct[item.product_name] || 0) + subtotal;

            const category = categoryByProductId.get(item.product_id) || "Uncategorized";
            revenueByCategory[category] = (revenueByCategory[category] || 0) + subtotal;

            totalQuantitySoldLast7Days += quantity;
            totalCogsLast7Days += quantity * (costByProductId.get(item.product_id) || 0);
          });

          const topProductsLast7Days = Object.entries(revenueByProduct)
            .map(([product_name, total_revenue]) => ({ product_name, total_revenue }))
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .slice(0, 5);
          setTopProducts(topProductsLast7Days);

          setCategoryRevenue(
            Object.entries(revenueByCategory).map(([category, revenue]) => ({ category, revenue }))
          );

          const totalRevenueLast7Days = Object.values(salesByDate).reduce((sum, v) => sum + v, 0);
          setGrossMargin(
            totalRevenueLast7Days > 0
              ? ((totalRevenueLast7Days - totalCogsLast7Days) / totalRevenueLast7Days) * 100
              : null
          );

          const avgDailyUnitsSold = totalQuantitySoldLast7Days / 7;
          setDaysOfStock(avgDailyUnitsSold > 0 ? totalStockUnits / avgDailyUnitsSold : null);

          // Purchase spend trend: mirrors the sales trend but sourced from orders placed
          // with suppliers, over the same rolling 7-day window.
          const orders = await orderService.getOrderListByUser(user);
          const purchaseByDate = {};
          for (let i = 0; i < 7; i++) {
            const bucketDate = new Date(windowStart);
            bucketDate.setDate(bucketDate.getDate() + i);
            purchaseByDate[bucketDate.toLocaleDateString()] = 0;
          }
          orders.forEach((o) => {
            if (o.status === "Cancelled") return;
            const oDate = new Date(o.created_at);
            if (oDate >= windowStart && oDate < windowEnd) {
              const dateStr = oDate.toLocaleDateString();
              const spend = o.total_cost ?? o.subtotal ?? 0;
              purchaseByDate[dateStr] = (purchaseByDate[dateStr] || 0) + spend;
            }
          });
          setPurchaseTrend(Object.keys(purchaseByDate).map((date) => ({ date, total: purchaseByDate[date] })));

          const lowStockFiltered = allProducts.filter((p) => p.stock <= p.low_stock);
          setLowStock(lowStockFiltered);
        } catch (error) {
          console.error("Error fetching product sales:", error);
        }

        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  const totalRevenue = categoryRevenue.reduce((acc, c) => acc + c.revenue, 0);
  const formatCurrency = (amount) => `Rp ${amount.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
  const COLORS = [
   "#6f42c1", "#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF4444",
];

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        px: { xs: 1.5, sm: 2, md: 4 },
      }}
    >
      {/* KPI Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
        <Box sx={{ flex: "1 1 260px" }}>
          <KpiCard
            title="Gross Margin (Last 7 Days)"
            value={grossMargin !== null ? `${grossMargin.toFixed(1)}%` : "N/A"}
            color="#009688"
          />
        </Box>
        <Box sx={{ flex: "1 1 260px" }}>
          <KpiCard
            title="Days of Stock Remaining"
            value={daysOfStock !== null ? `${daysOfStock.toFixed(1)} days` : "N/A"}
            color="#ff7043"
          />
        </Box>
      </Box>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* 1️⃣ Sales Trend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: "100%", height: isMobile ? 250 : 350 }}>
                <ResponsiveContainer width={isMobile ? 300 : 520} height={250}>
                  <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => [formatCurrency(value), "Sales"]} />
                    <Line type="monotone" dataKey="total" stroke="#6f42c1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 2️⃣ Top Products */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 5 Selling Products (Last 7 Days)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: "100%", height: isMobile ? 250 : 350 }}>
                <ResponsiveContainer width={isMobile ? 300 : 520} height={250}>
                  <BarChart
                    data={topProducts}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: isMobile ? 0 : 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCurrency} fontSize={isMobile ? 10 : 12} />
                    <YAxis
                      type="category"
                      dataKey="product_name"
                      width={isMobile ? 80 : 120}
                      fontSize={isMobile ? 10 : 12}
                    />
                    <Tooltip formatter={(value) => [formatCurrency(value), "Sales"]} />
                    <Bar dataKey="total_revenue" fill="#6f42c1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* 3️⃣ Sales Forecast (click through to detailed per-product breakdown) */}
      <Box sx={{ width: "100%", mb: 3 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": { transform: "scale(1.01)", boxShadow: 6 },
          }}
          onClick={() => navigate("/forecast")}
        >
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>
                  Sales Forecast
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projected revenue for the next 7 days, based on the recent trend. Click for a detailed per-product breakdown.
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: "#6f42c1", fontWeight: "bold", whiteSpace: "nowrap" }}>
                {formatCurrency(forecastPreview)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 4️⃣ Purchase Spend Trend */}
      <Box sx={{ width: "100%", mb: 3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Purchase Spend Trend (Last 7 Days)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ width: "100%", height: isMobile ? 250 : 350 }}>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 320}>
                <LineChart data={purchaseTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
                  <YAxis fontSize={isMobile ? 10 : 12} tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Spend"]} />
                  <Line type="monotone" dataKey="total" stroke="#ff7043" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* 5️⃣ Revenue by Category */}
      <Box sx={{ width: "100%", mb: 3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
            <Typography variant="h6" gutterBottom>
                Revenue by Category (Last 7 Days)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
                sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: isMobile ? 300 : 400,
                width: "100%",
                }}
            >
                <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                    data={categoryRevenue}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 60 : 100}
                    outerRadius={isMobile ? 90 : 120}
                    // fill="#6f42c1"
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, percent }) => isMobile ? `${(percent * 100).toFixed(1)}%`:`${name} ${(percent * 100).toFixed(1)}%`}
                    >
                    {categoryRevenue.map((entry, index) => (
                        <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index] || `hsl(${(index * 45) % 360}, 80%, 50%)`}
                        />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                    {isMobile && <Legend />}
                </PieChart>
                </ResponsiveContainer>
            </Box>
            </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />

        {/* 6️⃣ Low Stock Table */}
        <Typography variant="h6" gutterBottom>Low Stock Alerts ⚠️</Typography>
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
            <DynamicTable
                columns={[
                    { field: "id", label: "Product ID" },
                    { field: "name", label: "Product" },
                    { field: "stock", label: "Remaining Stock" },
                ]}
                rows={lowStock.map(item => ({
                    id: item.id,
                    name: item.name,
                    stock: item.stock,
                }))}
                actions={(row) => (
                    <Button
                        variant="contained"
                        onClick={() => handleClick(row)}
                        sx={{ backgroundColor: "#6f42c1" }}
                    >
                        Add Stock
                    </Button>
                )}
            />
        </Box>
    </Container>
  );
}

export default StatisticPage;
