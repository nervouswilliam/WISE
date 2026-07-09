import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Button,
    TextField,
    Alert
} from '@mui/material';
import DynamicTable from '../components/DynamicTable';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import customerService from '../services/customerService';
import Loading from '../components/loading';

function CustomerPage({ user }) {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data, error } = await customerService.getCustomerList(user);
            if (error) throw error;
            setCustomers(data || []);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customer data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!search.trim()) {
                fetchCustomers();
                return;
            }
            const results = await customerService.searchCustomer(user, search.trim());
            setCustomers(results);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleAddCustomerClick = () => navigate('/customer/add');
    const handleViewClick = (row) => navigate(`/customer/${row.id}`);

    const handleExportClick = () => {
        const headers = ['Name', 'Phone Number', 'Email'];
        const rows = customers.map((c) => {
            const formattedPhone = c.country_code && c.phone ? `(${c.country_code}) ${c.phone}` : c.phone || '';
            return [c.name, formattedPhone, c.email].join(',');
        });
        const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'customer_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <Loading />;

    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: '#6f42c1' }}
                    onClick={handleAddCustomerClick}
                >
                    Add New Customer
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

            <TextField
                fullWidth
                placeholder="Search by name, phone, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3 }}
            />

            <DynamicTable
                columns={[
                    { field: 'name', label: 'Name', sortable: true },
                    { field: 'phoneNumber', label: 'Phone Number', sortable: true },
                    { field: 'email', label: 'Email', sortable: true },
                ]}
                rows={customers.map((c) => ({
                    id: c.id,
                    name: c.name,
                    phoneNumber: c.country_code && c.phone ? `(${c.country_code}) ${c.phone}` : c.phone || '',
                    email: c.email,
                }))}
                actions={(row) => (
                    <Button
                        variant="contained"
                        onClick={() => handleViewClick(row)}
                        sx={{ backgroundColor: '#6f42c1' }}
                    >
                        VIEW
                    </Button>
                )}
            />
        </Container>
    );
}

export default CustomerPage;
