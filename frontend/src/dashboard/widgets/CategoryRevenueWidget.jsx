import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6f42c1', '#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF4444'];

function CategoryRevenueWidget({ data }) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Revenue by Category (Last 7 Days)</Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.categoryRevenue}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="75%"
              paddingAngle={3}
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.categoryRevenue.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default CategoryRevenueWidget;
