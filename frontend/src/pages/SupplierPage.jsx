import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import DynamicTable from '../components/DynamicTable';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';

// Mock service and data for demonstration
const supplierService = {
    getAllSuppliers: async () => {
        // Simulating an API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = [
                    { id: '1', name: 'Tech Innovations Inc.', phoneNumber: '123-456-7890', email: 'contact@techinnovations.com' },
                    { id: '2', name: 'Global Components Ltd.', phoneNumber: '098-765-4321', email: 'info@globalcomponents.net' },
                    { id: '3', name: 'Future Electronics', phoneNumber: '555-111-2222', email: 'support@future-elec.co' },
                ];
                resolve(mockData);
            }, 1000);
        });
    }
};

const exportToExcel = (data) => {
    // Basic CSV export logic
    const headers = ['Name', 'Phone Number', 'Email'];
    const rows = data.map(item => [item.name, item.phoneNumber, item.email].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "supplier_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function SupplierPage() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true);
                const fetchedSuppliers = await supplierService.getAllSuppliers();
                setSuppliers(fetchedSuppliers);
            } catch (err) {
                console.error("Error fetching suppliers:", err);
                setError("Failed to load supplier data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleAddSupplierClick = () => {
        navigate('/add-supplier');
    };

    const handleExportClick = () => {
        exportToExcel(suppliers);
    };

    const columns = [
        { field: 'name', label: 'Name' },
        { field: 'phoneNumber', label: 'Phone Number' },
        { field: 'email', label: 'Email' },
    ];

    const actions = (row) => (
        <Button 
            variant="contained" 
            size="small"
            sx={{
                backgroundColor:"#6f42c1"
            }}
            onClick={() => navigate(`/edit-supplier/${row.id}`)}
        >
            Edit
        </Button>
    );

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

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor:"#6f42c1"
                    }}
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
                columns={columns}
                rows={suppliers}
                actions={actions}
            />
        </Container>
    );
}

export default SupplierPage;