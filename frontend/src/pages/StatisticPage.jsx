import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import DynamicTable from "../components/DynamicTable";
import Loading from "../components/loading";

function StatisticPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClick = (row) => {
      navigate(`/product/stock-add/${row.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          const transactions = await transactionService.getSalesTransactions(user);
          const salesByDate = transactions
            .filter((t) => t.transaction_type === "sale")
            .reduce((acc, t) => {
              const dateStr = new Date(t.created_at).toLocaleDateString();
              acc[dateStr] = (acc[dateStr] || 0) + t.total_amount;
              return acc;
            }, {});
          setSalesTrend(Object.keys(salesByDate).map((date) => ({ date, total: salesByDate[date] })));

          const productSales = await transactionService.getProductSales(user);
          setTopProducts(productSales.slice(0,5));

          const categorySales = await productService.getProductSalesByCategory(user);
          if (categorySales && Array.isArray(categorySales)) {
            const formatted = categorySales.map(item => ({
              category: item.category_name,
              revenue: item.total_revenue
            }));
            setCategoryRevenue(formatted);
          }

          const lowStockItems = await productService.getProductList(user.id);
          const lowStockFiltered = lowStockItems.filter((p) => p.stock <= p.low_stock);
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
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* 1️⃣ Sales Trend */}
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top 5 Selling Products
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

        <Divider sx={{ my: 3 }} />
        {/* 3️⃣ Revenue by Category */}
        <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                    Revenue by Category
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
                    <ResponsiveContainer width={isMobile ? 300 : 1100} height={350}>
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
        </Grid>
        
        <Divider sx={{ my: 3 }} />

        {/* 4️⃣ Low Stock Table */}
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
      </Grid>
    </Container>
  );
}

export default StatisticPage;
