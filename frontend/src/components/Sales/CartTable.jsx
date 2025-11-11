// import React from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Box, Typography, IconButton, TextField
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';

// function CartTable({ cartItems, onRemoveItem, onUpdateQty }) {
//   const columns = [
//     { field: 'item', label: 'Item' },
//     { field: 'price', label: 'Price' },
//     { field: 'qty', label: 'Qty.' },
//     { field: 'subtotal', label: 'Subtotal' },
//     { field: 'actions', label: '' },
//   ];

//   const formatCurrency = (value) =>
//     new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

//   return (
//     <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//       <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
//         <TableContainer sx={{ flexGrow: 1 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 {columns.map(col => (
//                   <TableCell key={col.field}>{col.label}</TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {cartItems.map(item => (
//                 <TableRow key={item.id}>
//                   {/* Item name + stock */}
//                   <TableCell>
//                     <Box>
//                       <Typography>{item.name}</Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Stock: {item.stock}
//                       </Typography>
//                     </Box>
//                   </TableCell>

//                   {/* Price */}
//                   <TableCell>{formatCurrency(item.selling_price)}</TableCell>

//                   {/* Quantity input */}
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <IconButton
//                         size="small"
//                         onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))}
//                       >
//                         <RemoveIcon />
//                       </IconButton>

//                       <TextField
//                         size="small"
//                         type="number"
//                         value={item.qty}
//                         onChange={(e) => {
//                           const newQty = parseInt(e.target.value) || 1;
//                           onUpdateQty(item.id, newQty);
//                         }}
//                         inputProps={{
//                           min: 1,
//                           style: { textAlign: 'center', width: '60px' },
//                         }}
//                       />

//                       <IconButton
//                         size="small"
//                         onClick={() => onUpdateQty(item.id, item.qty + 1)}
//                       >
//                         <AddIcon />
//                       </IconButton>
//                     </Box>
//                   </TableCell>

//                   {/* Subtotal */}
//                   <TableCell>{formatCurrency(item.subtotal)}</TableCell>

//                   {/* Delete action */}
//                   <TableCell>
//                     <IconButton onClick={() => onRemoveItem(item.id)}>
//                       <DeleteIcon color="error" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }

// export default CartTable;


import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Typography, IconButton, TextField, Card, CardContent, Divider, useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from '@mui/material/styles';

function CartTable({ cartItems, onRemoveItem, onUpdateQty }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

  const columns = [
    { field: 'item', label: 'Item' },
    { field: 'price', label: 'Price' },
    { field: 'qty', label: 'Qty.' },
    { field: 'subtotal', label: 'Subtotal' },
    { field: 'actions', label: '' },
  ];

  // 🧭 MOBILE VIEW
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cartItems.map((item) => (
          <Card key={item.id} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {item.stock}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Price: {formatCurrency(item.selling_price)}
                  </Typography>
                  <Typography variant="body2">
                    Subtotal: {formatCurrency(item.subtotal)}
                  </Typography>
                </Box>

                <IconButton onClick={() => onRemoveItem(item.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // 💻 DESKTOP VIEW
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
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
