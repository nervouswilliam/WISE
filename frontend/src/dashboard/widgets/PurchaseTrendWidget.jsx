import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/currency';

function PurchaseTrendWidget({ data }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Purchase Spend Trend (Last 7 Days)</Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.purchaseTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => [formatCurrency(value), 'Spend']} />
            <Line type="monotone" dataKey="total" stroke="#ff7043" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default PurchaseTrendWidget;
