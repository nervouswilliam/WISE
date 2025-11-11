// import React from 'react';
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//     Box, Typography, IconButton
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// function CartTable({ cartItems, onRemoveItem }) {
//     const columns = [
//         { field: 'item', label: 'Item' },
//         { field: 'price', label: 'Price' },
//         { field: 'qty', label: 'Qty.' },
//         { field: 'subtotal', label: 'Subtotal' },
//         { field: 'actions', label: '' },
//     ];
    
//     return (
//         <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//             <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//                 <TableContainer sx={{ flexGrow: 1 }}>
//                     <Table stickyHeader>
//                         <TableHead>
//                             <TableRow>
//                                 {columns.map(col => (
//                                     <TableCell key={col.field}>{col.label}</TableCell>
//                                 ))}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {cartItems.map(item => (
//                                 <TableRow key={item.id}>
//                                     <TableCell>
//                                         <Box>
//                                             <Typography>{item.name}</Typography>
//                                             <Typography variant="body2" color="text.secondary">
//                                                 Stock: {item.stock}
//                                             </Typography>
//                                         </Box>
//                                     </TableCell>
//                                     <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.selling_price.toFixed(2))}</TableCell>
//                                     <TableCell>{item.qty}</TableCell>
//                                     <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal.toFixed(2))}</TableCell>
//                                     <TableCell>
//                                         <IconButton onClick={() => onRemoveItem(item.id)}>
//                                             <DeleteIcon color="error" />
//                                         </IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// }

// export default CartTable;

import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Typography, IconButton, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function CartTable({ cartItems, onRemoveItem, onUpdateQty }) {
  const columns = [
    { field: 'item', label: 'Item' },
    { field: 'price', label: 'Price' },
    { field: 'qty', label: 'Qty.' },
    { field: 'subtotal', label: 'Subtotal' },
    { field: 'actions', label: '' },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.field}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map(item => (
                <TableRow key={item.id}>
                  {/* Item name + stock */}
                  <TableCell>
                    <Box>
                      <Typography>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stock: {item.stock}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Price */}
                  <TableCell>{formatCurrency(item.selling_price)}</TableCell>

                  {/* Quantity input */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        size="small"
                        type="number"
                        value={item.qty}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          onUpdateQty(item.id, newQty);
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: 'center', width: '60px' },
                        }}
                      />

                      <IconButton
                        size="small"
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>

                  {/* Subtotal */}
                  <TableCell>{formatCurrency(item.subtotal)}</TableCell>

                  {/* Delete action */}
                  <TableCell>
                    <IconButton onClick={() => onRemoveItem(item.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default CartTable;
