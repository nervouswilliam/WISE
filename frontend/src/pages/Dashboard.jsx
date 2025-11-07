// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Button,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// import DynamicTable from '../components/DynamicTable';
// import productService from '../services/productService';
// import supplierService from '../services/supplierService';
// import transactionService from '../services/transactionService';
// import { useNavigate } from "react-router-dom";

// function DashboardPage({ user }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalSuppliers, setTotalSuppliers] = useState(0);
//   const [salesToday, setSalesToday] = useState(0);
//   const [lowStock, setLowStock] = useState(0);

//   const [salesData, setSalesData] = useState([]);
//   const [topProductsData, setTopProductsData] = useState([]);
//   const [recentTransactions, setRecentTransactions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Fetch total products
//         const products = await productService.getProductList(user.id);
//         setTotalProducts(products.length);

//         // Low stock products
//         const lowStockItems = products.filter(p => p.stock < 5);
//         setLowStock(lowStockItems.length);

//         // Fetch total suppliers
//         const suppliers = await supplierService.getSupplierList(user);
//         setTotalSuppliers(suppliers.data.length);
//         console.log(suppliers.data.length);

//         // Fetch sales data
//         const transactions = await transactionService.getTransactionsByPeriod(user, 'weekly');
//         setRecentTransactions(transactions); // last 10 transactions
//         const todaySales = transactions.filter(t => {
//           const tDate = new Date(t.created_at);
//           const today = new Date();
//           return tDate.toDateString() === today.toDateString();
//         });
//         setSalesToday(todaySales.reduce((sum, t) => sum + t.price_per_unit * t.quantity, 0));

//         // Placeholder sales chart (sum per day)
//         const salesChartData = transactions.map(t => ({
//           date: new Date(t.created_at).toLocaleDateString(),
//           total: t.price_per_unit * t.quantity
//         }));
//         setSalesData(salesChartData);

//         // Top products
//         const topProducts = products
//           .map(p => {
//             const soldQty = transactions.filter(t => t.product_id === p.id).reduce((sum, t) => sum + t.quantity, 0);
//             return { name: p.name, sold: soldQty };
//           })
//           .sort((a, b) => b.sold - a.sold)
//           .slice(0, 5);
//         setTopProductsData(topProducts);

//       } catch (err) {
//         console.error(err);
//         setError("Failed to load dashboard data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const handleAddProduct = () => {
//     navigate("/product/add");
//   };

//   const handleAddSupplier = () => {
//     navigate("/supplier/add");
//   };

//   const handleGenerateReport = () => {
//     console.log("Generate report");
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container sx={{ mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//       {/* KPI Cards */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle2">Total Products</Typography>
//               <Typography variant="h4">{totalProducts}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle2">Total Suppliers</Typography>
//               <Typography variant="h4">{totalSuppliers}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle2">Sales Today</Typography>
//               <Typography variant="h4">Rp {salesToday.toLocaleString()}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="subtitle2">Low Stock Items</Typography>
//               <Typography variant="h4" color="error">{lowStock}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Charts */}
//       <Grid container spacing={2} sx={{ mt: 2 }}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Sales Over Time</Typography>
//               <ResponsiveContainer width="100%" height={250}>
//                 <LineChart data={salesData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="total" stroke="#6f42c1" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Top-Selling Products</Typography>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={topProductsData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="sold" fill="#6f42c1" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Quick Actions */}
//       <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//         <Button variant="contained" sx={{ backgroundColor: '#6f42c1' }} startIcon={<AddIcon />} onClick={handleAddProduct}>
//           Add Product
//         </Button>
//         <Button variant="contained" sx={{ backgroundColor: '#6f42c1' }} startIcon={<AddIcon />} onClick={handleAddSupplier}>
//           Add Supplier
//         </Button>
//         <Button variant="contained" color="success" startIcon={<GetAppIcon />} onClick={handleGenerateReport}>
//           Generate Report
//         </Button>
//       </Box>

//       {/* Recent Transactions Table */}
//       <Card sx={{ mt: 2 }}>
//         <CardContent>
//           <Typography variant="h6">Recent Transactions</Typography>
//           <DynamicTable
//             columns={[
//               { field: 'id', label: 'ID' },
//               { field: 'productName', label: 'Product Name' },
//               { field: 'quantity', label: 'Quantity' },
//               { field: 'total', label: 'Total (Rp)' },
//               { field: 'TransactionType', label: 'Transaction Type' },
//               { field: 'date', label: 'Date' }
//             ]}
//             rows={recentTransactions.map(t => ({
//               id: t.transaction_id,
//               productName: t.product_name,
//               quantity: t.quantity,
//               total: (t.price_per_unit * t.quantity).toLocaleString(),
//               TransactionType: t.transaction_type,
//               date: new Date(t.created_at).toLocaleDateString()
//             }))}
//           />
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }

// export default DashboardPage;


import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider, // Added Divider for visual separation
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DynamicTable from '../components/DynamicTable';
// Assuming the following service imports are correct
import productService from '../services/productService';
import supplierService from '../services/supplierService';
import transactionService from '../services/transactionService';
import { useNavigate } from "react-router-dom";

// --- Custom/Helper Components for better presentation ---

// Reusable KPI Card component
const KpiCard = ({ title, value, color }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" sx={{ color: color || 'inherit' }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);


// --- Main Dashboard Component ---

function DashboardPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();
  
  const handleClick = (row) => {
      navigate(`/report/${row.id}`);
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch products and calculate metrics
        const products = await productService.getProductList(user.id);
        setTotalProducts(products.length);
        const lowStockItems = products.filter(p => p.stock < 5);
        setLowStock(lowStockItems.length);

        // Fetch suppliers
        const suppliers = await supplierService.getSupplierList(user);
        setTotalSuppliers(suppliers.data.length);

        // Fetch transactions
        const transactions = await transactionService.getTransactionsByPeriod(user, 'weekly');

        // Filter and calculate Sales Today
        const today = new Date();
        const todaySales = transactions.filter(t => {
          const tDate = new Date(t.created_at);
          return tDate.toDateString() === today.toDateString();
        }).reduce((sum, t) => sum + (t.total_amount || 0), 0);
        setSalesToday(todaySales);

        // Sales Chart Data (aggregated by date)
        const salesByDate = transactions.reduce((acc, t) => {
            const dateStr = new Date(t.created_at).toLocaleDateString();
            const total = t.total_amount;
            acc[dateStr] = (acc[dateStr] || 0) + total;
            return acc;
        }, {});
        setSalesData(Object.keys(salesByDate).map(date => ({ date, total: salesByDate[date] })));


        // Top Products
        const productSales = await transactionService.getProductSales(user);
        const topProducts = productSales
            .map(ps => ({ name: ps.product_name, sold: ps.total_sold }))
            .slice(0, 5);
        setTopProductsData(topProducts);

        // Recent transactions (e.g., last 10)
        setRecentTransactions(transactions.slice(0, 10));

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please check network and service connectivity.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  const handleAddSupplier = () => {
    navigate("/supplier/add");
  };

  const handleGenerateReport = () => {
    // Implement report generation logic here
    alert("Report generation feature is pending implementation.");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
      return `Rp ${amount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

        {/* 1. Row: KPI Cards (4 in a row) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Total Products" value={totalProducts} color="#3f51b5" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Total Suppliers" value={totalSuppliers} color="#4caf50" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Sales Today" value={formatCurrency(salesToday)} color="#ff9800" />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
                <KpiCard title="Low Stock Items" value={lowStock} color="#f44336" />
            </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 2. Row: Charts (Sales Over Time and Top Selling Products) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={7}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Sales Over Time</Typography>
                        <ResponsiveContainer width={450} height={250}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} width={100} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Line type="monotone" dataKey="total" stroke="#6f42c1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={5}>
                <Card sx={{ height: '100%', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Top-Selling Products</Typography>
                        <ResponsiveContainer width={450} height={250}>
                            <BarChart data={topProductsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sold" fill="#6f42c1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* 3. Row: Action Buttons (Add Product, Add Supplier, Generate Report) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#6f42c1' }}
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                fullWidth={false} // Override fullWidth on mobile
            >
                Add Product
            </Button>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#6f42c1' }}
                startIcon={<AddIcon />}
                onClick={handleAddSupplier}
                fullWidth={false}
            >
                Add Supplier
            </Button>
            <Button
                variant="contained"
                color="success"
                startIcon={<GetAppIcon />}
                onClick={handleGenerateReport}
                fullWidth={false}
            >
                Generate Report
            </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 4. Row: Recent Transactions Table */}
        <Grid container>
            <Grid item xs={12}>
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                        <DynamicTable
                            columns={[
                                { field: 'id', label: 'ID' },
                                { field: 'total', label: 'Total (Rp)' },
                                { field: 'TransactionType', label: 'Type' },
                                { field: 'date', label: 'Date' }
                            ]}
                            rows={recentTransactions.map(t => ({
                                id: t.transaction_id,
                                // Formatting total using the helper function
                                total: formatCurrency(t.total_amount),
                                TransactionType: t.transaction_type,
                                date: new Date(t.created_at).toLocaleDateString('id-ID')
                            }))}
                            actions={(row) => (
                              <Button
                                variant="contained"
                                onClick={() => handleClick(row)}
                                sx={{ backgroundColor: "#6f42c1" }}
                              >
                                VIEW
                              </Button>
                            )}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Container>
  );
}

export default DashboardPage;