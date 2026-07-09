import React, { useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { buildTopProducts } from '../timeframeUtils';

function TopProductsWidget({ data }) {
  const [timeframe, setTimeframe] = useState('daily');
  const topProductsData = useMemo(
    () => buildTopProducts(data.rawTransactionItems, data.rawSalesTransactions, timeframe),
    [data.rawTransactionItems, data.rawSalesTransactions, timeframe]
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ mb: 0 }}>Top-Selling Products</Typography>
        <FormControl size="small">
          <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topProductsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" fill="#6f42c1" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default TopProductsWidget;
