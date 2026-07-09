import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/DynamicTable';
import { formatCurrency } from '../../utils/currency';

function RecentTransactionsWidget({ data, editMode }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        <DynamicTable
          columns={[
            { field: 'id', label: 'ID' },
            { field: 'total', label: 'Total (Rp)' },
            { field: 'TransactionType', label: 'Type' },
            { field: 'date', label: 'Date' },
          ]}
          rows={data.recentTransactions.map((t) => ({
            id: t.transaction_id,
            total: formatCurrency(t.total_amount),
            TransactionType: t.transaction_type,
            date: new Date(t.created_at).toLocaleDateString('id-ID'),
          }))}
          actions={(row) => (
            <Button
              variant="contained"
              disabled={editMode}
              onClick={() => navigate(`/report/${row.id}`)}
              sx={{ backgroundColor: '#6f42c1' }}
            >
              VIEW
            </Button>
          )}
        />
      </Box>
    </Box>
  );
}

export default RecentTransactionsWidget;
