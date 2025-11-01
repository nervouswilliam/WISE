import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import supplierService from '../services/supplierService'; // You'll need to create this service
import { supabase } from '../supabaseClient';

function AddEditSupplierPage({user}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id !== undefined;

    const [supplier, setSupplier] = useState({
        id: '',
        country_code: '+62',
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const countryCodes = [
        { code: '+62', country: 'Indonesia' },
        { code: '+65', country: 'Singapore' },
        { code: '+1', country: 'USA' },
        { code: '+44', country: 'UK' },
        { code: '+81', country: 'Japan' },
        { code: '+86', country: 'China' },
    ];

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSupplierData = async () => {
            if (isEditMode) {
                try {
                    setLoading(true);
                    const response = await supplierService.getSupplierDetail(id);
                    setSupplier(response.data);
                } catch (err) {
                    console.error('Error fetching supplier data:', err);
                    setError('Failed to load supplier details.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchSupplierData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplier(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submissionData = {
                name: supplier.name,
                country_code: supplier.country_code,
                phone: supplier.phone,
                email: supplier.email,
                address: supplier.address,
                notes: supplier.notes,
                user_id: user.id,
            };

            if (isEditMode) {
                await supplierService.editSupplier(supplier.id, submissionData);
            } else {
                await supplierService.addSupplier(submissionData);
            }

            alert(`Supplier ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate('/supplier'); // redirect to supplier list
        } catch (err) {
            console.error('Error submitting supplier data:', err);
            setError('Failed to save supplier. Please try again.');
        }
    };

    const handleBackClick = () => navigate(-1);

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
        console.log(supplier) ||
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <Button
                    onClick={handleBackClick}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mr: 2, backgroundColor: "#6f42c1", color: "white" }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1">
                    {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    boxShadow: 1
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Supplier Name"
                            name="name"
                            value={supplier.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth required>
                            <InputLabel>Code</InputLabel>
                            <Select
                                name="country_code"
                                value={supplier.country_code || '+62'}
                                label="Code"
                                onChange={handleChange}
                            >
                                {countryCodes.map((country) => (
                                    <MenuItem key={country.code} value={country.code}>
                                        {country.code} ({country.country})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={supplier.phone}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={supplier.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={supplier.address}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={supplier.notes}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={isEditMode ? <SaveIcon /> : <AddIcon />}
                            sx={{ mt: 2, backgroundColor:"#6f42c1" }}
                        >
                            {isEditMode ? 'Save Changes' : 'Add Supplier'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default AddEditSupplierPage;
