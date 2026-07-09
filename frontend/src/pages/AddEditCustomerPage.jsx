import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import customerService from '../services/customerService';
import Loading from '../components/loading';

function AddEditCustomerPage({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id !== undefined;

    const [customer, setCustomer] = useState({
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
        const fetchCustomerData = async () => {
            if (isEditMode) {
                try {
                    setLoading(true);
                    const { data, error } = await customerService.getCustomerDetail(id);
                    if (error) throw error;
                    setCustomer(data);
                } catch (err) {
                    console.error('Error fetching customer data:', err);
                    setError('Failed to load customer details.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submissionData = {
                name: customer.name,
                country_code: customer.country_code,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                notes: customer.notes,
                user_id: user.id,
            };

            const { error } = isEditMode
                ? await customerService.editCustomer(customer.id, submissionData)
                : await customerService.addCustomer(submissionData);
            if (error) throw error;

            alert(`Customer ${isEditMode ? 'updated' : 'added'} successfully!`);
            navigate('/customer');
        } catch (err) {
            console.error('Error submitting customer data:', err);
            setError('Failed to save customer. Please try again.');
        }
    };

    const handleBackClick = () => navigate(-1);

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

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <Button
                    onClick={handleBackClick}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mr: 2, backgroundColor: '#6f42c1', color: 'white' }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1">
                    {isEditMode ? 'Edit Customer' : 'Add New Customer'}
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
                            label="Customer Name"
                            name="name"
                            value={customer.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Code</InputLabel>
                            <Select
                                name="country_code"
                                value={customer.country_code || '+62'}
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
                            value={customer.phone}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={customer.email}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={customer.address}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={customer.notes}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            startIcon={isEditMode ? <SaveIcon /> : <AddIcon />}
                            sx={{ mt: 2, backgroundColor: '#6f42c1' }}
                        >
                            {isEditMode ? 'Save Changes' : 'Add Customer'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default AddEditCustomerPage;
