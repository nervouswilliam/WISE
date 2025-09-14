import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';

function SalesSummary({ totals }) {
  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totals.subtotal.toFixed(2))}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Discounts</Typography>
        <Typography color="error">-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totals.discounts.toFixed(2))}</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">TOTAL</Typography>
        <Typography variant="h6">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totals.total.toFixed(2))}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography>PAID</Typography>
        <Typography>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totals.paid.toFixed(2))}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>DUE</Typography>
        <Typography variant="h6" color="error">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totals.due.toFixed(2))}</Typography>
      </Box>
    </Box>
  );
}

export default SalesSummary;