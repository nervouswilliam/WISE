import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Link as MuiLink // Use MuiLink for styling and Link from react-router-dom for routing
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/system';
import authService from '../services/authService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import productService from '../services/productService';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '+62',
        phoneNumber: '',
        password: '',
        imageUrl: '',
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            console.log(file);
            const imageUrl = await productService.addImageUrl(file, 'profile_picture', 'profilePic_' + Date.now());
            setFormData((prev) => ({ ...prev, imageUrl }));
            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Image upload failed. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };


    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         handleImageUpload(file);
    //     }
    // };

    // const handleImageUpload = (file) => {
    //     if (!file) return;

    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);

    //     reader.onloadstart = () => setUploadingImage(true);

    //     reader.onload = async () => {
    //         const base64StringWithPrefix = reader.result;
    //         const base64String = base64StringWithPrefix.split(',')[1];
    //         try {
    //             const response = await productService.addImageUrl(base64String);
    //             const newImageUrl = response.output_schema["imageUrl"];

    //             setFormData(prevFormData => ({
    //                 ...prevFormData,
    //                 imageUrl: newImageUrl,
    //             }));
    //             setError(null);
    //             alert("Image uploaded successfully!");
    //         } catch (err) {
    //             console.error("Image upload failed:", err);
    //             setError("Image upload failed. Please try again.");
    //         } finally {
    //             setUploadingImage(false);
    //         }
    //     };

    //     reader.onerror = () => {
    //         setUploadingImage(false);
    //         setError("An error occurred while reading the file.");
    //     };
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploadingImage) {
            alert("Please wait for the image to finish uploading.");
            return;
        }
        
        // if (!formData.imageUrl) {
        //     setError("Please upload a profile picture.");
        //     return;
        // }

        try {
            await authService.signup(formData);
            alert('Account created successfully!');
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err);
            setError(err.message);
        }
    };

    const countryCodes = [
        { code: '+62', country: 'Indonesia' },
        { code: '+65', country: 'Singapore' },
        { code: '+1', country: 'USA' },
        { code: '+44', country: 'UK' },
        { code: '+81', country: 'Japan' },
        { code: '+86', country: 'China' },
    ];

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create an Account
                </Typography>

                {/* <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={formData.imageUrl}
                        sx={{ width: 100, height: 100 }}
                    />
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={uploadingImage ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? 'Uploading...' : 'Upload Profile Picture'}
                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                    </Button>
                </Box> */}
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    fullWidth
                    label="Username"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth required>
                            <InputLabel>Code</InputLabel>
                            <Select
                                name="countryCode"
                                value={formData.countryCode}
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
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 , backgroundColor:"#6f42c1"}}
                >
                    Sign Up
                </Button>
                <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                  <Typography variant="body2" mr={1}>
                    Already have an account?
                  </Typography>
                  <MuiLink component={RouterLink} to="/login" color="#6f42c1" underline="hover">
                    Login
                  </MuiLink>
                </Box>
            </Box>
        </Container>
    );
}

export default SignupPage;