import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forecastNextDays } from '../../utils/forecast';
import { formatCurrency } from '../../utils/currency';
import { buildSalesSeries } from '../timeframeUtils';

function ForecastPreviewWidget({ data, editMode }) {
  const navigate = useNavigate();

  const forecastPreview = useMemo(() => {
    const series = buildSalesSeries(data.rawSalesTransactions, 'weekly').map((d) => d.total);
    const { predictions } = forecastNextDays(series, 7);
    return predictions.reduce((a, b) => a + b, 0);
  }, [data.rawSalesTransactions]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: editMode ? 'default' : 'pointer',
      }}
      onClick={() => !editMode && navigate('/forecast')}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 0.5 }}>Sales Forecast</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Projected revenue for the next 7 days. Click for a detailed per-product breakdown.
      </Typography>
      <Typography variant="h4" sx={{ color: '#6f42c1', fontWeight: 'bold' }}>
        {formatCurrency(forecastPreview)}
      </Typography>
    </Box>
  );
}

export default ForecastPreviewWidget;
