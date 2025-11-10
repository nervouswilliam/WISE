// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Container,
//     Typography,
//     Box,
//     Button,
//     Grid,
//     CircularProgress,
//     Alert
// } from '@mui/material';
// import DynamicTable from '../components/DynamicTable';
// import AddIcon from '@mui/icons-material/Add';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import supplierService from '../services/supplierService';

// const [supplier, setSupplier] = useState([]);

// const getSupplierList = async () => {
//     try {
//         const response = await supplierService.getSupplierList(user);
//         if (response.error) throw new Error(response.error.message);
//         setSupplier(response.data);
//     } catch (error) {
//         console.error("Error fetching supplier list:", error);
//     }
// };

// const exportToExcel = (data) => {
//     // Basic CSV export logic
//     const headers = ['Name', 'Phone Number', 'Email'];
//     const rows = data.map(item => [item.name, item.phoneNumber, item.email].join(','));
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "supplier_data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };

// function SupplierPage() {
//     const [suppliers, setSuppliers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchSuppliers = async () => {
//             try {
//                 setLoading(true);
//                 const fetchedSuppliers = await supplierService.getSupplierList();
//                 setSuppliers(fetchedSuppliers || []);
//             } catch (err) {
//                 console.error("Error fetching suppliers:", err);
//                 setError("Failed to load supplier data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSuppliers();
//     }, []);

//     const handleAddSupplierClick = () => {
//         navigate('/supplier/add');
//     };

//     const handleExportClick = () => {
//         exportToExcel(suppliers);
//     };

//     const columns = [
//         { field: 'name', label: 'Name' },
//         { field: 'phoneNumber', label: 'Phone Number' },
//         { field: 'email', label: 'Email' },
//     ];

//     const actions = (row) => (
//         <Button 
//             variant="contained" 
//             size="small"
//             sx={{
//                 backgroundColor:"#6f42c1"
//             }}
//             onClick={() => navigate(`/edit-supplier/${row.id}`)}
//         >
//             Edit
//         </Button>
//     );

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Container sx={{ mt: 4 }}>
//                 <Alert severity="error">{error}</Alert>
//             </Container>
//         );
//     }

//     return (
//         <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     sx={{
//                         backgroundColor:"#6f42c1"
//                     }}
//                     onClick={handleAddSupplierClick}
//                 >
//                     Add New Supplier
//                 </Button>
//                 <Button
//                     variant="contained"
//                     color="success"
//                     startIcon={<GetAppIcon />}
//                     onClick={handleExportClick}
//                 >
//                     Export to Excel
//                 </Button>
//             </Box>
            
//             <DynamicTable
//                 columns={[
//                     { field: "id", label: "Id", sortable: true },
//                     { field: "name", label: "Name", sortable: true },
//                     { field: "phone", label: "Phone Number", sortable: true },
//                     { field: "email", label: "Email", sortable: true }
//                 ]}
//                 rows={product.map((p) => ({
//                     id: p.id,
//                     name: p.name,
//                     phone: p.phone,
//                     email: p.email
//                 }))}
//                 actions={(row) => <Button variant="contained" onClick={() => handleClick(row)} sx={{backgroundColor: "#6f42c1"}}>VIEW</Button>}
//             />
//         </Container>
//     );
// }

// export default SupplierPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import DynamicTable from '../components/DynamicTable';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import supplierService from '../services/supplierService';
import Loading from '../components/loading';


function SupplierPage({user}) {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                const fetchedSuppliers = await supplierService.getSupplierList(user);
                if (Array.isArray(fetchedSuppliers)) {
                    setSuppliers(fetchedSuppliers);
                } else if (fetchedSuppliers && Array.isArray(fetchedSuppliers.data)) {
                    // This handles a common API response structure like { data: [...] }
                    setSuppliers(fetchedSuppliers.data);
                } else {
                    // Fallback to an empty array if it's not a usable array
                    setSuppliers([]);
                }
            } catch (err) {
                console.error("Error fetching suppliers:", err);
                setError("Failed to load supplier data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleAddSupplierClick = () => navigate('/supplier/add');

    const handleExportClick = () => {
        const headers = ['Name', 'Phone Number', 'Email'];
        const rows = suppliers.map(supplier => {
            const formattedPhone = `(${supplier.country_code}) ${supplier.phone}`;
            return [supplier.name, formattedPhone, supplier.email].join(',');
        });
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "supplier_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewClick = (row) => navigate(`/supplier/${row.id}`);

    if (loading) return (
        <Loading />
    );

    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor:"#6f42c1" }}
                    onClick={handleAddSupplierClick}
                >
                    Add New Supplier
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<GetAppIcon />}
                    onClick={handleExportClick}
                >
                    Export to Excel
                </Button>
            </Box>

            <DynamicTable
                columns={[
                    { field: "id", label: "ID", sortable: true },
                    { field: "name", label: "Name", sortable: true },
                    { field: "phoneNumber", label: "Phone Number", sortable: true },
                    { field: "email", label: "Email", sortable: true }
                ]}
                rows={suppliers.map((s) => ({
                    id: s.id,
                    name: s.name,
                    phoneNumber: s.country_code && s.phone 
                    ? `(${s.country_code}) ${s.phone}` 
                    : s.phone || '',
                    email: s.email
                }))}
                actions={(row) => (
                    <Button
                        variant="contained"
                        onClick={() => handleViewClick(row)}
                        sx={{ backgroundColor: "#6f42c1" }}
                    >
                        VIEW
                    </Button>
                )}
            />
        </Container>
    );
}

export default SupplierPage;
