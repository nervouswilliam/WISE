// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   IconButton,
//   Typography,
//   Button,
//   Chip,
//   CircularProgress,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   Card,
//   CardContent,
//   Divider,
//   Pagination,
// } from '@mui/material';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import DownloadIcon from '@mui/icons-material/Download';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import SearchBar from '../helper/Search';

// // Define interfaces for our data structure
// interface Order {
//   id: string;
//   customer: string;
//   trackingId: string;
//   orderDate: string;
//   quantity: number;
//   location: string;
//   total: string;
//   status: 'Completed' | 'In Process' | 'Pending';
//   [key: string]: string | number | 'Completed' | 'In Process' | 'Pending';
// }

// // Column definition interface
// interface ColumnDefinition {
//   id: keyof Order | 'actions' | 'checkbox';
//   label: string;
//   align?: 'left' | 'right' | 'center';
//   format?: (value: any) => React.ReactNode;
//   width?: string | number;
//   sortable?: boolean;
//   priority?: number; // Higher number = higher priority to show on small screens
// }

// const Product: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
//   // State for orders
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
//   const [selectAll, setSelectAll] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Define columns with priority for responsive design
//   const columns: ColumnDefinition[] = [
//     { id: 'checkbox', label: '', width: '50px', priority: 1 },
//     { id: 'id', label: 'Order', sortable: true, priority: 1 },
//     { id: 'customer', label: 'Customers', sortable: true, priority: 2 },
//     { id: 'trackingId', label: 'Tracking Id', sortable: true, priority: 4 },
//     { id: 'orderDate', label: 'Order Date', sortable: true, priority: 5 },
//     { id: 'quantity', label: 'Quantity', align: 'left', sortable: true, priority: 6 },
//     { id: 'location', label: 'Location', sortable: true, priority: 7 },
//     { id: 'total', label: 'Total', align: 'left', sortable: true, priority: 3 },
//     { 
//       id: 'status', 
//       label: 'Status', 
//       sortable: true,
//       priority: 1,
//       format: (value: 'Completed' | 'In Process' | 'Pending') => (
//         <Chip
//           label={value}
//           color={
//             value === 'Completed' ? 'success' : 
//             value === 'In Process' ? 'info' : 
//             'secondary'
//           }
//           size="small"
//           sx={{ 
//             fontWeight: 'medium',
//             borderRadius: 1,
//             '&.MuiChip-colorSuccess': { bgcolor: 'rgba(84, 214, 44, 0.16)', color: '#229A16' },
//             '&.MuiChip-colorInfo': { bgcolor: 'rgba(24, 144, 255, 0.16)', color: '#1890FF' },
//             '&.MuiChip-colorSecondary': { bgcolor: 'rgba(145, 85, 253, 0.16)', color: '#9155FD' },
//           }}
//         />
//       )
//     },
//     { id: 'actions', label: 'Action', width: '80px', priority: 1 },
//   ];

//   // Get visible columns based on screen size
//   const getVisibleColumns = () => {
//     if (isMobile) {
//       // Show only high priority columns on mobile
//       return columns.filter(col => col.priority && col.priority <= 3);
//     } else if (isTablet) {
//       // Show medium priority columns on tablet
//       return columns.filter(col => col.priority && col.priority <= 5);
//     }
//     // Show all columns on desktop
//     return columns;
//   };

//   // Sample data - in a real app, this would come from an API
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call with timeout
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Mock data
//       const mockOrders: Order[] = [
//         { id: '#1002', customer: 'Arlene McCoy', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 20, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         { id: '#1002', customer: 'Floyd Miles', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 24, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         { id: '#1002', customer: 'Ralph Edwards', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 12, location: 'Sylhet, Bondor', total: '$500.00', status: 'Pending' },
//         { id: '#1002', customer: 'Brooklyn Simmons', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         { id: '#1002', customer: 'Dianne Russell', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 20, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         { id: '#1002', customer: 'Devon Lane', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         { id: '#1002', customer: 'Courtney Henry', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Pending' },
//         { id: '#1002', customer: 'Esther Howard', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 0, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         { id: '#1002', customer: 'Jenny Wilson', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         { id: '#1002', customer: 'Jenny Wilson', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//       ];
      
//       setOrders(mockOrders);
//       setFilteredOrders(mockOrders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       // Handle error state here
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect to fetch data on component mount
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Effect to handle search filtering
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredOrders(orders);
//     } else {
//       const lowercasedSearch = searchTerm.toLowerCase();
//       const filtered = orders.filter(order => 
//         order.customer.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.id.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.trackingId.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.location.toString().toLowerCase().includes(lowercasedSearch)
//       );
//       setFilteredOrders(filtered);
//     }
//   }, [searchTerm, orders]);

//   // Handle select all checkboxes
//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedOrders(new Set());
//     } else {
//       // Create a new set with all order IDs
//       const allOrderIds = new Set(filteredOrders.map((order, index) => `${order.id}-${index}`));
//       setSelectedOrders(allOrderIds);
//     }
//     setSelectAll(!selectAll);
//   };

//   // Handle individual checkbox selection
//   const handleSelectOrder = (orderId: string, index: number) => {
//     const orderKey = `${orderId}-${index}`;
//     const newSelectedOrders = new Set(selectedOrders);
    
//     if (newSelectedOrders.has(orderKey)) {
//       newSelectedOrders.delete(orderKey);
//     } else {
//       newSelectedOrders.add(orderKey);
//     }
    
//     setSelectedOrders(newSelectedOrders);
//     setSelectAll(newSelectedOrders.size === filteredOrders.length);
//   };

//   // Handle search
//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//   };

//   // Function to handle row actions (e.g., edit, delete, etc.)
//   const handleRowAction = (order: Order) => {
//     console.log('Action for order:', order);
//     // Implement your action logic here
//   };

//   // Handle export functionality
//   const handleExport = () => {
//     console.log('Exporting data...');
//     // Implement your export logic here
//   };

//   // Function to render card view for mobile
//   const renderCardView = () => {
//     return (
//       <Box sx={{ width: '100%' }}>
//         {filteredOrders.length === 0 ? (
//           <Box sx={{ textAlign: 'center', py: 3 }}>
//             No data found
//           </Box>
//         ) : (
//           <Stack spacing={2}>
//             {filteredOrders.map((order, index) => (
//               <Card key={index} sx={{ width: '100%' }}>
//                 <CardContent sx={{ p: 2 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Checkbox
//                         checked={selectedOrders.has(`${order.id}-${index}`)}
//                         onChange={() => handleSelectOrder(order.id, index)}
//                         sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
//                       />
//                       <Typography variant="subtitle1">{order.id}</Typography>
//                     </Box>
//                     {columns.find(col => col.id === 'status')?.format?.(order.status)}
//                   </Box>
                  
//                   <Divider sx={{ my: 1 }} />
                  
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body2" color="text.secondary">Customer</Typography>
//                       <Typography variant="body2">{order.customer}</Typography>
//                     </Box>
                    
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="body2" color="text.secondary">Total</Typography>
//                       <Typography variant="body2">{order.total}</Typography>
//                     </Box>
                    
//                     {!isMobile && (
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="body2" color="text.secondary">Date</Typography>
//                         <Typography variant="body2">{order.orderDate}</Typography>
//                       </Box>
//                     )}
//                   </Box>
                  
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
//                     <IconButton size="small" onClick={() => handleRowAction(order)}>
//                       <MoreHorizIcon />
//                     </IconButton>
//                   </Box>
//                 </CardContent>
//               </Card>
//             ))}
//           </Stack>
//         )}
//       </Box>
//     );
//   };

//   // Function to render table view
//   const renderTableView = () => {
//     const visibleColumns = getVisibleColumns();
    
//     return (
//       <TableContainer
//         component={Paper}
//         elevation={0}
//         sx={{
//           border: '1px solid #f0f0f0',
//           width: '100%',
//           overflowX: 'auto'
//         }}
//       >
//         <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
//           <TableHead sx={{ bgcolor: '#7142B0' }}>
//             <TableRow>
//               {visibleColumns.map((column) => (
//                 <TableCell
//                   key={column.id.toString()}
//                   align={column.align || 'left'}
//                   sx={{
//                     color: '#FFFFFF',
//                     width: column.width,
//                     fontWeight: 'normal',
//                     padding: column.id === 'checkbox' ? '0 0 0 16px' : undefined,
//                     whiteSpace: 'nowrap',
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis'
//                   }}
//                 >
//                   {column.id === 'checkbox' ? (
//                     <Checkbox
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       sx={{ '& .MuiSvgIcon-root': { fontSize: 20 }, color: 'white', '&.Mui-checked': {color: 'white'}}}
//                     />
//                   ) : column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredOrders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={visibleColumns.length} align="center" sx={{ py: 3 }}>
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredOrders.map((order, index) => (
//                 <TableRow
//                   key={index}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   {visibleColumns.map((column) => (
//                     <TableCell
//                       key={`${index}-${column.id.toString()}`}
//                       align={column.align || 'left'}
//                       padding={column.id === 'checkbox' ? 'checkbox' : 'normal'}
//                       sx={{
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis'
//                       }}
//                     >
//                       {column.id === 'checkbox' ? (
//                         <Checkbox
//                           checked={selectedOrders.has(`${order.id}-${index}`)}
//                           onChange={() => handleSelectOrder(order.id, index)}
//                           sx={{ '& .MuiSvgIcon-root': { fontSize: 20 }, paddingLeft: 2.5 }}
//                         />
//                       ) : column.id === 'actions' ? (
//                         <IconButton size="small" onClick={() => handleRowAction(order)}>
//                           <MoreHorizIcon />
//                         </IconButton>
//                       ) : column.format && typeof column.id === 'string' ? (
//                         column.format(order[column.id])
//                       ) : (
//                         typeof column.id === 'string' ? order[column.id] : null
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     );
//   };

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '100vw' }}>
//         <Typography 
//             variant="h4" 
//             component="div" 
//             sx={{ 
//             fontWeight: "bold",
//             margin: 0,
//             padding: 2,
//             lineHeight: 1,
//             fontFamily: "inherit", // This will inherit from your CSS
//             }}
//         >
//             Produk
//         </Typography>

//       <Box sx={{ 
//         mb: 2, 
//         display: 'flex', 
//         flexDirection: { xs: 'column', sm: 'row' },
//         alignItems: 'stretch',
//         gap: 2 
//       }}>
//         <Box sx={{ flexGrow: 1, mb: { xs: 2, sm: 0 } }}>
//           <SearchBar onSearch={handleSearch} />
//         </Box>
        
//         <Stack 
//           direction={{ xs: 'column', sm: 'row' }} 
//           spacing={2}
//           sx={{ width: { xs: '100%', sm: 'auto' } }}
//         >
//           <Button 
//             variant="outlined" 
//             startIcon={<FilterAltIcon />}
//             sx={{ 
//               bgcolor: '#f5f5f5', 
//               color: '#000', 
//               borderColor: '#ddd', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//           >
//             Filter
//           </Button>
          
//           <Button 
//             variant="outlined" 
//             startIcon={<CalendarTodayIcon />}
//             sx={{ 
//               bgcolor: '#f5f5f5', 
//               color: '#000', 
//               borderColor: '#ddd', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//           >
//             Date
//           </Button>
          
//           <Button 
//             variant="contained" 
//             startIcon={<DownloadIcon />}
//             sx={{ 
//               bgcolor: '#6C49B8', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//             onClick={handleExport}
//           >
//             Export
//           </Button>
//         </Stack>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         // Conditionally render card view for mobile or table view for larger screens
//         isMobile ? renderCardView() : renderTableView()
//       )}
//         <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//         <Pagination 
//             count={1.0} 
//             sx={{ 
//                 '& .MuiPaginationItem-root': { color: '#7142B0' }, // Text color
//                 '& .MuiPaginationItem-page.Mui-selected': { 
//                 backgroundColor: '#7142B0', 
//                 color: '#fff' // Selected page text color
//                 },
//                 '& .MuiPaginationItem-page.Mui-selected:hover': { 
//                 backgroundColor: '#5a2e8e' // Darker shade on hover
//                 }
//             }} 
//         />
//         </Box>
//     </Box>
//   );
// };

// export default Product;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Stack,
//   useTheme,
//   useMediaQuery,
//   Chip,
// } from '@mui/material';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import DownloadIcon from '@mui/icons-material/Download';
// import SearchBar from '../helper/Search';
// import ResponsiveDataTable, { ColumnDefinition, DataItem } from '../helper/TableHelper';
// import { apiService } from '../api';

// // Define interfaces for our data structure
// interface Order extends DataItem {
//   name: string;
//   price: string;
//   stock: string;
//   category: number;
// }

// const Product: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   // State for orders
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
  
//   // Define columns with priority for responsive design
//   const columns: ColumnDefinition<Order>[] = [
//     { id: 'checkbox', label: '', width: '50px', priority: 1 },
//     { id: 'id', label: 'Produk ID', sortable: true, priority: 1 },
//     { id: 'name', label: 'Nama Produk', sortable: true, priority: 2 },
//     { id: 'price', label: 'Harga', sortable: true, priority: 4 },
//     { id: 'stock', label: 'Stock', sortable: true, priority: 5 },
//     { id: 'Cateogory', label: 'Category', align: 'left', sortable: true, priority: 6 },
//     // { 
//     //   id: 'status', 
//     //   label: 'Status', 
//     //   sortable: true,
//     //   priority: 1,
//     //   format: (value: 'Completed' | 'In Process' | 'Pending') => (
//     //     <Chip
//     //       label={value}
//     //       color={
//     //         value === 'Completed' ? 'success' : 
//     //         value === 'In Process' ? 'info' : 
//     //         'secondary'
//     //       }
//     //       size="small"
//     //       sx={{ 
//     //         fontWeight: 'medium',
//     //         borderRadius: 1,
//     //         '&.MuiChip-colorSuccess': { bgcolor: 'rgba(84, 214, 44, 0.16)', color: '#229A16' },
//     //         '&.MuiChip-colorInfo': { bgcolor: 'rgba(24, 144, 255, 0.16)', color: '#1890FF' },
//     //         '&.MuiChip-colorSecondary': { bgcolor: 'rgba(145, 85, 253, 0.16)', color: '#9155FD' },
//     //       }}
//     //     />
//     //   )
//     // },
//     { id: 'actions', label: 'Action', width: '80px', priority: 1 },
//   ];

//   // Sample data - in a real app, this would come from an API
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call with timeout
//       // await new Promise(resolve => setTimeout(resolve, 500));
//       const response = await apiService.get<Order>[]("products/list", {search, page});
//       const errorCode = response?.error_schema.error_code;
//       const output = response?.output_schema;
//       if(errorCode === "S001"){
//         setOrders(output);
//       }
//       // Mock data
//       const mockOrders: Order[] = [
//         // { id: '#1002', customer: 'Arlene McCoy', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 20, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         // { id: '#1002', customer: 'Floyd Miles', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 24, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         // { id: '#1002', customer: 'Ralph Edwards', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 12, location: 'Sylhet, Bondor', total: '$500.00', status: 'Pending' },
//         // { id: '#1002', customer: 'Brooklyn Simmons', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         // { id: '#1002', customer: 'Dianne Russell', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 20, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         // { id: '#1002', customer: 'Devon Lane', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         // { id: '#1002', customer: 'Courtney Henry', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Pending' },
//         // { id: '#1002', customer: 'Esther Howard', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 0, location: 'Sylhet, Bondor', total: '$500.00', status: 'In Process' },
//         // { id: '#1002', customer: 'Jenny Wilson', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//         // { id: '#1002', customer: 'Jenny Wilson', trackingId: '#TS121321', orderDate: 'Today - 4:20 pm', quantity: 15, location: 'Sylhet, Bondor', total: '$500.00', status: 'Completed' },
//       ];
      
//       setOrders(mockOrders);
//       setFilteredOrders(mockOrders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       // Handle error state here
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Effect to fetch data on component mount
//   useEffect(() => {
//     fetchOrders();
//   }, [search, page]);

//   // Effect to handle search filtering
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredOrders(orders);
//     } else {
//       const lowercasedSearch = searchTerm.toLowerCase();
//       const filtered = orders.filter(order => 
//         order.customer.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.id.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.trackingId.toString().toLowerCase().includes(lowercasedSearch) ||
//         order.location.toString().toLowerCase().includes(lowercasedSearch)
//       );
//       setFilteredOrders(filtered);
//     }
//   }, [searchTerm, orders]);

//   // Handle search
//   const handleSearch = (value: string) => {
//     setSearchTerm(value);
//     setCurrentPage(1); // Reset to first page on new search
//   };

//   // Function to handle row actions (e.g., edit, delete, etc.)
//   const handleRowAction = (order: Order) => {
//     console.log('Action for order:', order);
//     // Implement your action logic here
//   };

//   // Handle export functionality
//   const handleExport = () => {
//     console.log('Exporting data...');
//     // Implement your export logic here
//   };

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     // In a real application, you might need to fetch data for the new page here
//   };

//   // Calculate total pages
//   const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '100vw' }}>
//       <Typography 
//         variant="h4" 
//         component="div" 
//         sx={{ 
//           fontWeight: "bold",
//           margin: 0,
//           padding: 2,
//           lineHeight: 1,
//           fontFamily: "inherit",
//         }}
//       >
//         Produk
//       </Typography>

//       <Box sx={{ 
//         mb: 2, 
//         display: 'flex', 
//         flexDirection: { xs: 'column', sm: 'row' },
//         alignItems: 'stretch',
//         gap: 2 
//       }}>
//         <Box sx={{ flexGrow: 1, mb: { xs: 2, sm: 0 } }}>
//           <SearchBar onSearch={setSearch} />
//         </Box>
        
//         <Stack 
//           direction={{ xs: 'column', sm: 'row' }} 
//           spacing={2}
//           sx={{ width: { xs: '100%', sm: 'auto' } }}
//         >
//           <Button 
//             variant="outlined" 
//             startIcon={<FilterAltIcon />}
//             sx={{ 
//               bgcolor: '#f5f5f5', 
//               color: '#000', 
//               borderColor: '#ddd', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//           >
//             Filter
//           </Button>
          
//           <Button 
//             variant="outlined" 
//             startIcon={<CalendarTodayIcon />}
//             sx={{ 
//               bgcolor: '#f5f5f5', 
//               color: '#000', 
//               borderColor: '#ddd', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//           >
//             Date
//           </Button>
          
//           <Button 
//             variant="contained" 
//             startIcon={<DownloadIcon />}
//             sx={{ 
//               bgcolor: '#6C49B8', 
//               px: 2,
//               width: { xs: '100%', sm: 'auto' }
//             }}
//             onClick={handleExport}
//           >
//             Export
//           </Button>
//         </Stack>
//       </Box>

//       <ResponsiveDataTable
//         columns={columns}
//         data={filteredOrders}
//         loading={loading}
//         onRowAction={handleRowAction}
//         rowsPerPage={rowsPerPage}
//         totalPages={totalPages}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         primaryColor="#7142B0"
//       />
//     </Box>
//   );
// };

// export default Product;


// import * as React from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID'},
//   { field: 'firstName', headerName: 'First name' },
//   { field: 'lastName', headerName: 'Last name' },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const paginationModel = { page: 0, pageSize: 5 };

// export default function Product() {
//   return (
//     <Paper sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{ pagination: { paginationModel } }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//         sx={{ border: 0 }}
//       />
//     </Paper>
//   );
// }


import { Product, ProductColumn } from "./ProductColumn"
import { ProductTable } from "../helper/TableHelper"
import { apiService } from "../api"
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";

async function getData(): Promise<Product[]> {
  // Fetch data from your API here.
  try{
    const response = await apiService.get<Product[]>("products/list");
    const errorCode = response?.error_schema.error_code;
    const outputSchema = response.output_schema;
    if(errorCode === "S001"){
      return outputSchema;
    }
    return [];
  } catch {
      console.error("Error Fetching Products");
      return [
        {
          id: "PT001",
          name: "XBOX Controller",
          price: 750000.00,
          stock: 150,
          category_name: "utility",
        },
        // ...
      ]
  }
}

export default function ProductPage() {
  // const data = await getData()
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getData()
      .then(products => {
        setData(products);
      })
      .catch(
        error => {
        console.error("Failed to fetch products:", error);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array means this only runs once on mount

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: "bold",
            margin: 0,
            padding: 2,
            lineHeight: 1,
            fontFamily: "inherit", // This will inherit from your CSS
          }}
      >
        Produk
      </Typography>
      <div className="container mx-auto py-10">
        <ProductTable columns={ProductColumn} data={data} />
      </div>
    </div>
  )
}

