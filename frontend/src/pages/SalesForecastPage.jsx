import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import transactionService from '../services/transactionService';
import productService from '../services/productService';
import KpiCard from '../components/KpiCard';
import Loading from '../components/loading';
import { forecastNextDays, classifyTrend } from '../utils/forecast';

const HISTORY_DAYS = 30;
const FORECAST_DAYS = 7;

function SalesForecastPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [productForecasts, setProductForecasts] = useState([]);
  const [totalForecastRevenue, setTotalForecastRevenue] = useState(0);
  const [totalForecastUnits, setTotalForecastUnits] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const historyStart = new Date(todayStart);
        historyStart.setDate(historyStart.getDate() - (HISTORY_DAYS - 1));

        const [transactions, items, products] = await Promise.all([
          transactionService.getSalesTransactions(user),
          transactionService.getAllTransactionItems(user),
          productService.getProductList(user.id),
        ]);

        const saleTransactionDates = new Map(
          transactions.map((t) => [t.transaction_id, new Date(t.created_at)])
        );

        // Map each date in the history window to a day index, so items can be bucketed
        // into per-day series without a nested date-comparison loop.
        const dayIndexByDateStr = new Map();
        const dateLabels = [];
        for (let i = 0; i < HISTORY_DAYS; i++) {
          const d = new Date(historyStart);
          d.setDate(d.getDate() + i);
          const key = d.toLocaleDateString();
          dayIndexByDateStr.set(key, i);
          dateLabels.push(key);
        }

        const productSeries = new Map(); // product_id -> units per day array
        const productInfo = new Map(); // product_id -> { name, selling_price, stock }
        products.forEach((p) => {
          productInfo.set(p.id, { name: p.name, selling_price: p.selling_price, stock: p.stock });
        });

        const totalDailyRevenue = new Array(HISTORY_DAYS).fill(0);

        items.forEach((item) => {
          const tDate = saleTransactionDates.get(item.transaction_id);
          if (!tDate) return;
          const dayIndex = dayIndexByDateStr.get(tDate.toLocaleDateString());
          if (dayIndex === undefined) return; // outside the history window

          if (!productSeries.has(item.product_id)) {
            productSeries.set(item.product_id, new Array(HISTORY_DAYS).fill(0));
          }
          productSeries.get(item.product_id)[dayIndex] += item.quantity || 0;
          totalDailyRevenue[dayIndex] += item.subtotal || 0;
        });

        // Overall revenue forecast, used for the chart + KPI cards.
        const revenueForecast = forecastNextDays(totalDailyRevenue, FORECAST_DAYS);

        const chart = dateLabels.map((label, i) => ({
          date: label,
          actual: totalDailyRevenue[i],
          forecast: null,
        }));
        for (let i = 0; i < FORECAST_DAYS; i++) {
          const d = new Date(todayStart);
          d.setDate(d.getDate() + i + 1);
          chart.push({ date: d.toLocaleDateString(), actual: null, forecast: revenueForecast.predictions[i] });
        }
        // Bridge the two series at the seam so the lines connect visually.
        if (chart.length > HISTORY_DAYS) {
          chart[HISTORY_DAYS - 1].forecast = chart[HISTORY_DAYS - 1].actual;
        }
        setChartData(chart);
        setTotalForecastRevenue(revenueForecast.predictions.reduce((a, b) => a + b, 0));

        // Per-product forecast table.
        const perProduct = [];
        let totalUnits = 0;
        productSeries.forEach((series, productId) => {
          const info = productInfo.get(productId);
          if (!info) return;

          const { predictions, slope } = forecastNextDays(series, FORECAST_DAYS);
          const forecastUnits = predictions.reduce((a, b) => a + b, 0);
          const avgDaily = series.reduce((a, b) => a + b, 0) / HISTORY_DAYS;
          const trend = classifyTrend(slope, avgDaily);
          const daysOfStock = avgDaily > 0 ? info.stock / avgDaily : null;

          totalUnits += forecastUnits;
          perProduct.push({
            productId,
            name: info.name,
            avgDaily,
            trend,
            forecastUnits,
            forecastRevenue: forecastUnits * (info.selling_price || 0),
            stock: info.stock,
            daysOfStock,
          });
        });
        perProduct.sort((a, b) => b.forecastRevenue - a.forecastRevenue);
        setProductForecasts(perProduct);
        setTotalForecastUnits(totalUnits);
      } catch (err) {
        console.error('Error building sales forecast:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const formatCurrency = (amount) => `Rp ${Math.round(amount || 0).toLocaleString('id-ID')}`;

  const trendIcon = (trend) => {
    if (trend === 'Increasing') return <TrendingUpIcon fontSize="small" sx={{ color: '#2e7d32' }} />;
    if (trend === 'Decreasing') return <TrendingDownIcon fontSize="small" sx={{ color: '#c62828' }} />;
    return <TrendingFlatIcon fontSize="small" sx={{ color: '#9e9e9e' }} />;
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        px: { xs: 1.5, sm: 2, md: 4 },
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 2 : 3, mb: isMobile ? 2 : 3 }}>
        <Box sx={{ flex: '1 1 260px' }}>
          <KpiCard
            title={`Forecasted Revenue (Next ${FORECAST_DAYS} Days)`}
            value={formatCurrency(totalForecastRevenue)}
            color="#6f42c1"
          />
        </Box>
        <Box sx={{ flex: '1 1 260px' }}>
          <KpiCard
            title={`Forecasted Units Sold (Next ${FORECAST_DAYS} Days)`}
            value={Math.round(totalForecastUnits)}
            color="#009688"
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sales Forecast (Last {HISTORY_DAYS} Days + Next {FORECAST_DAYS} Days Projected)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ width: '100%', height: isMobile ? 250 : 350 }}>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} minTickGap={20} />
                <YAxis fontSize={isMobile ? 10 : 12} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#6f42c1" strokeWidth={2} dot={false} connectNulls={false} />
                <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#ff7043" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Per-Product Sales Forecast
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Trend</TableCell>
                  <TableCell align="right">Avg Daily Units</TableCell>
                  <TableCell align="right">Forecast Units ({FORECAST_DAYS}d)</TableCell>
                  <TableCell align="right">Forecast Revenue ({FORECAST_DAYS}d)</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Est. Days Until Stockout</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productForecasts.map((p) => (
                  <TableRow key={p.productId}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{trendIcon(p.trend)}</TableCell>
                    <TableCell align="right">{p.avgDaily.toFixed(1)}</TableCell>
                    <TableCell align="right">{Math.round(p.forecastUnits)}</TableCell>
                    <TableCell align="right">{formatCurrency(p.forecastRevenue)}</TableCell>
                    <TableCell align="right">{p.stock}</TableCell>
                    <TableCell align="right">{p.daysOfStock !== null ? p.daysOfStock.toFixed(1) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {productForecasts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No sales history yet to forecast from.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SalesForecastPage;
