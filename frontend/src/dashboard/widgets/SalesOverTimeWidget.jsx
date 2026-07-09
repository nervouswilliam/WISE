import React, { useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { buildSalesSeries } from '../timeframeUtils';
import { formatCurrency } from '../../utils/currency';

function SalesOverTimeWidget({ data }) {
  const [timeframe, setTimeframe] = useState('daily');
  const salesData = useMemo(
    () => buildSalesSeries(data.rawSalesTransactions, timeframe),
    [data.rawSalesTransactions, timeframe]
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ mb: 0 }}>Sales Over Time</Typography>
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
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} width={100} />
            <Tooltip formatter={formatCurrency} />
            <Line type="monotone" dataKey="total" stroke="#6f42c1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default SalesOverTimeWidget;
