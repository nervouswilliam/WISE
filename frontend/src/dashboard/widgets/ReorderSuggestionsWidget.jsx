import React from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ReorderSuggestionsWidget({ data, editMode }) {
  const navigate = useNavigate();
  const suggestions = data.reorderSuggestions;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Reorder Suggestions</Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
        {suggestions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nothing needs reordering right now.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Days Left</TableCell>
                <TableCell align="right">Suggested Qty</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suggestions.map((s) => (
                <TableRow key={s.productId}>
                  <TableCell>{s.productName}</TableCell>
                  <TableCell align="right">{s.stock}</TableCell>
                  <TableCell align="right">{s.daysOfStock !== null ? s.daysOfStock.toFixed(1) : 'N/A'}</TableCell>
                  <TableCell align="right">{s.suggestedQty}</TableCell>
                  <TableCell>{s.supplierName || 'Unassigned'}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      disabled={editMode}
                      sx={{ backgroundColor: '#6f42c1' }}
                      onClick={() => navigate(`/product/stock-add/${s.productId}?suggested=${s.suggestedQty}`)}
                    >
                      Create Order
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
}

export default ReorderSuggestionsWidget;
