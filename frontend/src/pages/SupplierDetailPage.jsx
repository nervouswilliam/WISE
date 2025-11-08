import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import supplierService from '../services/supplierService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from '../components/loading';

function SupplierDetailPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                setLoading(true);
                const response = await supplierService.getSupplierDetail(id);
                if (!response) throw new Error("Supplier not found");
                setSupplier(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load supplier data.");
            } finally {
                setLoading(false);
            }
        };

        fetchSupplier();
    }, [id]);

    const handleEdit = () => navigate(`/supplier/edit/${id}`);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await supplierService.deleteSupplier(id);
                alert("Supplier deleted successfully.");
                navigate('/supplier');
            } catch (err) {
                console.error(err);
                alert("Failed to delete supplier.");
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

    if (!supplier) {
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
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

            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, boxShadow: 1 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Name</Typography>
                        <Typography variant="body1">{supplier.name}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Phone Number</Typography>
                        <Typography variant="body1">
                            {supplier.country_code ? `(${supplier.country_code}) ` : ''}{supplier.phone}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography variant="body1">{supplier.email}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Address</Typography>
                        <Typography variant="body1">{supplier.address}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">Notes</Typography>
                        <Typography variant="body1">{supplier.notes}</Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
        </Container>
    );
}

export default SupplierDetailPage;
