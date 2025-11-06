import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
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
} from 'recharts';
import { useTheme } from '@mui/material/styles';

function StatisticPage() {
  const [loading, setLoading] = useState(true);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data fetch simulation
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        setSalesTrend([
          { date: 'Oct 25', sales: 420 },
          { date: 'Oct 26', sales: 390 },
          { date: 'Oct 27', sales: 580 },
          { date: 'Oct 28', sales: 610 },
          { date: 'Oct 29', sales: 550 },
          { date: 'Oct 30', sales: 730 },
          { date: 'Oct 31', sales: 800 },
        ]);

        setTopProducts([
          { name: 'Coca-Cola', sales: 1200 },
          { name: 'Lays Chips', sales: 900 },
          { name: 'Nescafe', sales: 750 },
          { name: 'Indomie', sales: 650 },
          { name: 'Sprite', sales: 400 },
        ]);

        setCategoryRevenue([
          { category: 'Beverages', revenue: 3200 },
          { category: 'Snacks', revenue: 2100 },
          { category: 'Instant Food', revenue: 1300 },
          { category: 'Household', revenue: 600 },
          { category: 'Frozen Food', revenue: 500 },
          { category: 'Dairy', revenue: 900 },
        ]);

        setLowStock([
          { id: 1, name: 'Pepsi', stock: 4 },
          { id: 2, name: 'Tissue Roll', stock: 3 },
          { id: 3, name: 'Milo', stock: 2 },
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const totalRevenue = categoryRevenue.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        px: { xs: 1.5, sm: 2, md: 4 },
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        gutterBottom
        fontWeight="bold"
        color="#6f42c1"
      >
        Business Statistics
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: { xs: 2, md: 3 }, color: 'text.secondary' }}
      >
        Track your sales performance, top products, and inventory insights below.
      </Typography>

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Sales Trend */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ width: '100%', height: isMobile ? 250 : 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#6f42c1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue by Category */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue by Category
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 2,
                  pb: 1,
                  '&::-webkit-scrollbar': { height: 6 },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#bdbdbd',
                    borderRadius: 4,
                  },
                }}
              >
                {categoryRevenue.map((c, index) => {
                  const percentage = ((c.revenue / totalRevenue) * 100).toFixed(1);
                  return (
                    <Card
                      key={index}
                      sx={{
                        minWidth: isMobile ? 240 : 300,
                        flex: '0 0 auto',
                        borderRadius: 2,
                        boxShadow: 1,
                        borderLeft: '5px solid #6f42c1',
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" color="#6f42c1">
                          {c.category}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Revenue: ${c.revenue.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Contribution: {percentage}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(percentage)}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6f42c1',
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Low Stock Alerts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Remaining Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StatisticPage;
