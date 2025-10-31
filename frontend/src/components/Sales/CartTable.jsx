// import React from 'react';
// import { Box, Button, Typography, IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// // Assuming you have a DynamicTable component
// import DynamicTable from '../DynamicTable';

// function CartTable({ cartItems }) {
//   const columns = [
//     { field: 'item', label: 'Item' },
//     { field: 'price', label: 'Price' },
//     { field: 'qty', label: 'Qty.' },
//     { field: 'disc', label: 'Disc.' },
//     { field: 'subtotal', label: 'Subtotal' },
//     { field: 'actions', label: '' },
//   ];

//   const rows = cartItems.map(item => ({
//     item: (
//       <Box>
//         <Typography>{item.name}</Typography>
//         <Typography variant="body2" color="text.secondary">
//           Stock: {item.stock}
//         </Typography>
//       </Box>
//     ),
//     price: `$${item.price.toFixed(2)}`,
//     qty: item.qty,
//     disc: `${item.discount}%`,
//     subtotal: `$${item.subtotal.toFixed(2)}`,
//     actions: (
//       <IconButton>
//         <DeleteIcon color="error" />
//       </IconButton>
//     ),
//   }));

//   return (
//     <DynamicTable columns={columns} rows={rows} />
//   );
// }

// export default CartTable;

import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box, Typography, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CartTable({ cartItems, onRemoveItem }) {
    const columns = [
        { field: 'item', label: 'Item' },
        { field: 'price', label: 'Price' },
        { field: 'qty', label: 'Qty.' },
        { field: 'subtotal', label: 'Subtotal' },
        { field: 'actions', label: '' },
    ];
    
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
                                    <TableCell>
                                        <Box>
                                            <Typography>{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Stock: {item.stock}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.selling_price.toFixed(2))}</TableCell>
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal.toFixed(2))}</TableCell>
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