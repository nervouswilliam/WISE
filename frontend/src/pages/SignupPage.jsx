import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Badge,
    IconButton,
    CircularProgress,
    Alert,
    Link as MuiLink // Use MuiLink for styling and Link from react-router-dom for routing
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonOutline from '@mui/icons-material/PersonOutline';
import MailOutline from '@mui/icons-material/MailOutline';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';
import authService from '../services/authService';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import productService from '../services/productService';

const PRIMARY_COLOR = '#6f42c1'; // Purple - matches LoginPage
const ACCENT_COLOR = '#f3f4f6'; // Light Gray - matches LoginPage

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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
            const imageUrl = await productService.addImageUrl(file, 'profile_picture', 'profilePic_' + Date.now());
            setFormData((prev) => ({ ...prev, imageUrl }));
        } catch (err) {
            console.error("Upload failed:", err);
            setError("Image upload failed. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== formData.password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (uploadingImage) {
            setError('Please wait for the profile picture to finish uploading.');
            return;
        }
        if (formData.password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setSubmitting(true);
        try {
            await authService.signup(formData);
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err);
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setSubmitting(false);
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
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: ACCENT_COLOR,
                p: 2,
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    display: 'flex',
                    // Key responsiveness: Stack on mobile, side-by-side on desktop - mirrors LoginPage
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    maxWidth: '1000px',
                    borderRadius: 2,
                    overflow: 'hidden',
                    my: 4,
                }}
            >
                {/* Left side: Illustration/Branding Panel (Hidden on mobile) */}
                <Box
                    sx={{
                        flex: 1,
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        backgroundColor: PRIMARY_COLOR,
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Wisely
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 4 }}>
                        Everything your business needs, in one place.
                    </Typography>
                    <Box component="img" src="/loginLogo.png" alt="Signup Illustration" sx={{ width: '80%', height: 'auto' }} />
                </Box>

                {/* Right side: Signup Form */}
                <Box
                    sx={{
                        flex: 1.2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 4, md: 6 },
                        backgroundColor: 'white',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        fontWeight="bold"
                        sx={{ mb: 3, color: PRIMARY_COLOR }}
                    >
                        Create an Account
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {/* Profile picture (optional) */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton
                                        component="label"
                                        size="small"
                                        disabled={uploadingImage}
                                        sx={{
                                            backgroundColor: PRIMARY_COLOR,
                                            color: 'white',
                                            width: 32,
                                            height: 32,
                                            '&:hover': { backgroundColor: '#5a34a8' },
                                        }}
                                    >
                                        {uploadingImage ? (
                                            <CircularProgress size={16} sx={{ color: 'white' }} />
                                        ) : (
                                            <PhotoCameraIcon fontSize="small" />
                                        )}
                                        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
                                    </IconButton>
                                }
                            >
                                <Avatar
                                    src={formData.imageUrl || undefined}
                                    sx={{ width: 84, height: 84, backgroundColor: ACCENT_COLOR, color: PRIMARY_COLOR }}
                                >
                                    {!formData.imageUrl && <PersonOutline sx={{ fontSize: 40 }} />}
                                </Avatar>
                            </Badge>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Profile picture (optional)
                            </Typography>
                        </Box>

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: <PersonOutline sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: <MailOutline sx={{ color: 'action.active', mr: 1 }} />,
                            }}
                        />

                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <Grid size={{ xs: 4 }}>
                                <FormControl fullWidth required margin="normal">
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
                            <Grid size={{ xs: 8 }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <PhoneOutlined sx={{ color: 'action.active', mr: 1 }} />,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: <LockOutlined sx={{ color: 'action.active', mr: 1 }} />,
                                endAdornment: (
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((v) => !v)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={passwordsMismatch}
                            helperText={passwordsMismatch ? "Passwords don't match" : ' '}
                            InputProps={{
                                startAdornment: <LockOutlined sx={{ color: 'action.active', mr: 1 }} />,
                                endAdornment: (
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword((v) => !v)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting || uploadingImage}
                            sx={{
                                mt: 2,
                                mb: 1,
                                py: 1.5,
                                backgroundColor: PRIMARY_COLOR,
                                '&:hover': { backgroundColor: '#5a34a8' },
                            }}
                        >
                            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                        </Button>

                        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                            <Typography variant="body2" color="text.secondary" mr={1}>
                                Already have an account?
                            </Typography>
                            <MuiLink component={RouterLink} to="/login" color={PRIMARY_COLOR} underline="hover">
                                Login
                            </MuiLink>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default SignupPage;
