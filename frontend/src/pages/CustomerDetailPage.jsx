import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Alert,
    Grid,
    Divider
} from '@mui/material';
import customerService from '../services/customerService';
import DynamicTable from '../components/DynamicTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../components/loading';
import { formatCurrency } from '../utils/currency';

function CustomerDetailPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const { data, error } = await customerService.getCustomerDetail(id);
                if (error || !data) throw error || new Error('Customer not found');
                setCustomer(data);

                const history = await customerService.getPurchaseHistory(user, id);
                setPurchases(history);
            } catch (err) {
                console.error(err);
                setError('Failed to load customer data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id]);

    const handleEdit = () => navigate(`/customer/edit/${id}`);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                const { error } = await customerService.deleteCustomer(id);
                if (error) throw error;
                alert('Customer deleted successfully.');
                navigate('/customer');
            } catch (err) {
                console.error(err);
                alert('Failed to delete customer.');
            }
        }
    };

    const handleBack = () => navigate(-1);

    if (loading) {
        return (<Loading />);
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!customer) {
        return null;
    }

    const totalSpent = purchases
        .filter((p) => p.transaction_type === 'sale')
        .reduce((sum, p) => sum + (p.total_amount || 0), 0);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    sx={{ backgroundColor: '#6f42c1', mr: 2 }}
                    onClick={handleBack}
                >
                    Back
                </Button>
            </Box>

            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, boxShadow: 1, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography variant="body1">{customer.name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Phone Number</Typography>
                        <Typography variant="body1">
                            {customer.country_code ? `(${customer.country_code}) ` : ''}{customer.phone || '-'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body1">{customer.email || '-'}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Address</Typography>
                        <Typography variant="body1">{customer.address || '-'}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Notes</Typography>
                        <Typography variant="body1">{customer.notes || '-'}</Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 1, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ backgroundColor: '#6f42c1' }}
                            onClick={handleEdit}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, boxShadow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Purchase History</Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Total spent: {formatCurrency(totalSpent)}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {purchases.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No purchases recorded for this customer yet.
                    </Typography>
                ) : (
                    <DynamicTable
                        columns={[
                            { field: 'date', label: 'Date' },
                            { field: 'type', label: 'Type' },
                            { field: 'total', label: 'Total' },
                        ]}
                        rows={purchases.map((p) => ({
                            id: p.transaction_id,
                            date: new Date(p.created_at).toLocaleDateString('id-ID'),
                            type: p.transaction_type,
                            total: formatCurrency(p.total_amount),
                        }))}
                    />
                )}
            </Box>
        </Container>
    );
}

export default CustomerDetailPage;
