import React, { useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import orderService from '../../services/orderService';
import supplierService from '../../services/supplierService';
import { formatCurrency } from '../../utils/currency';

function ReorderSuggestionsWidget({ data, editMode, user }) {
  const suggestions = data.reorderSuggestions;
  const [orderingId, setOrderingId] = useState(null);
  const [orderedIds, setOrderedIds] = useState(new Set());

  const handleCreateOrder = async (s) => {
    if (!s.supplierName) {
      alert(`${s.productName} has no supplier assigned. Add one on the product's edit page first.`);
      return;
    }

    const total = formatCurrency((s.price || 0) * s.suggestedQty);
    const confirmed = window.confirm(
      `Order ${s.suggestedQty} x ${s.productName} from ${s.supplierName} for ${total}?`
    );
    if (!confirmed) return;

    setOrderingId(s.productId);
    try {
      const supplierId = await supplierService.getSupplierId(s.supplierName, user);
      if (!supplierId) {
        alert(`Couldn't find supplier "${s.supplierName}" - it may have been renamed or removed.`);
        return;
      }

      const unitPrice = s.price || 0;
      const order = await orderService.addOrder({
        product_id: s.productId,
        quantity_ordered: s.suggestedQty,
        unit_price: unitPrice,
        subtotal: unitPrice * s.suggestedQty,
        total_cost: unitPrice * s.suggestedQty,
        supplier_id: supplierId,
        expected_arrival: new Date().toISOString(),
        status: 'Pending',
        notes: 'Auto-created from dashboard reorder suggestion.',
        user_id: user.id,
      });

      if (!order) {
        alert('Failed to create the order. Please try again.');
        return;
      }
      setOrderedIds((prev) => new Set(prev).add(s.productId));
    } catch (err) {
      console.error('Error creating order from suggestion:', err);
      alert('Failed to create the order. Please try again.');
    } finally {
      setOrderingId(null);
    }
  };

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
                    {orderedIds.has(s.productId) ? (
                      <Chip size="small" color="success" icon={<CheckIcon />} label="Ordered" />
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        disabled={editMode || orderingId === s.productId || !s.supplierName}
                        sx={{ backgroundColor: '#6f42c1' }}
                        onClick={() => handleCreateOrder(s)}
                      >
                        {orderingId === s.productId ? <CircularProgress size={16} color="inherit" /> : 'Create Order'}
                      </Button>
                    )}
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
