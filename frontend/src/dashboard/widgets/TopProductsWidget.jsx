import React, { useMemo, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { buildTopProducts } from '../timeframeUtils';

const MAX_LABEL_LENGTH = 14;
// Only shortens the axis tick text - the Tooltip reads the full name straight off the
// underlying data point (see CustomTooltip below), so hovering a bar always shows what
// it actually represents regardless of how the axis label got truncated.
const truncateName = (name) =>
  name && name.length > MAX_LABEL_LENGTH ? `${name.slice(0, MAX_LABEL_LENGTH)}…` : name;

// Explicit content renderer instead of relying on recharts' automatic label-axis
// detection - guarantees the full product name shows up top, not the truncated tick.
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, sold } = payload[0].payload;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 3,
        px: 1.5,
        py: 1,
      }}
    >
      <Typography variant="body2" fontWeight={600}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {sold} units sold
      </Typography>
    </Box>
  );
}

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
          <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} fontSize={12} />
            <YAxis type="category" dataKey="name" width={100} tickFormatter={truncateName} fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sold" fill="#6f42c1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default TopProductsWidget;
