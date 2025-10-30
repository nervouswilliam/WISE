import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Alert,
    Grid,
    TextField,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import authService from '../services/authService';

function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await authService.whoami();
                setUser(response.identities?.[0]?.identity_data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setError("Failed to load user data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const countryCodes = [
        { code: '+62', country: 'Indonesia' },
        { code: '+65', country: 'Singapore' },
        { code: '+1', country: 'USA' },
        { code: '+44', country: 'UK' },
        { code: '+81', country: 'Japan' },
        { code: '+86', country: 'China' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await authService.updateUser(user);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        User Profile
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box component="form" onSubmit={handleSave}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={user?.username || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={user?.email || ''}
                                    onChange={handleChange}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Code</InputLabel>
                                    <Select
                                        name="countryCode"
                                        value={user?.countryCode || ''}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={user?.phoneNumber || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 0 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        disabled={isSaving}
                                        sx={{
                                            backgroundColor:"#6f42c1"
                                        }}
                                    >
                                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                    </Button>
                                </CardActions>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default SettingsPage;
