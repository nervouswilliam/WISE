import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { MailOutline, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import authService from "../services/authService";
import Loading from "../components/loading";

const PRIMARY_COLOR = '#6f42c1'; // Purple
const ACCENT_COLOR = '#f3f4f6'; // Light Gray

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      console.log(data)
      localStorage.setItem("token", data);
      localStorage.setItem("isAuthenticated", "true");
      // navigate("/dashboard");
      window.location.href = "/dashboard";
      
    } catch (err) {
      console.error(err.message);
      setError("Invalid Credentials!");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box 
        sx={{
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: ACCENT_COLOR,
            p: 2
        }}
    >
      <Paper
        elevation={8}
        sx={{
          display: 'flex',
          // Key responsiveness: Stack on mobile, side-by-side on desktop
          flexDirection: { xs: 'column', md: 'row' }, 
          width: '100%',
          maxWidth: '1000px', // Overall max width for the card
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        
        {/* Left side: Illustration/Branding Panel (Hidden on mobile) */}
        <Box
          sx={{
            flex: 1,
            // Hide on extra small screens
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
            Your centralized Warehouse Management platform.
          </Typography>
          {/* Mock Illustration using SVG */}
          <Box component="img" src="/loginLogo.png" alt="Login Illustration" sx={{ width: '80%', height: 'auto' }}/>
        </Box>
        
        {/* Right side: Login Form */}
        <Box
          sx={{
            flex: 1.2, // Make form slightly wider than illustration on desktop
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, md: 6 }, // Responsive padding
            backgroundColor: 'white',
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            fontWeight="bold" 
            sx={{ mb: 4, color: PRIMARY_COLOR }}
          >
            Welcome Back
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            
            {/* Email Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <MailOutline sx={{ color: 'action.active', mr: 1 }} />
                ),
              }}
            />
            
            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <LockOutlined sx={{ color: 'action.active', mr: 1 }} />
                ),
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ 
                mt: 4, 
                mb: 2, 
                py: 1.5,
                backgroundColor: PRIMARY_COLOR,
                '&:hover': {
                  backgroundColor: '#5a34a8', // Darker shade on hover
                },
                position: 'relative',
              }}
            >
              {isLoading ? <Loading /> : 'Sign In'}
            </Button>
            
            {/* Sign Up Link */}
            <Box display="flex" alignItems="center" justifyContent="center" mt={3}>
              <Typography variant="body2" color="text.secondary" mr={1}>
                Don't have an account?
              </Typography>
              <Link href="/signup" color="#6f42c1" underline="hover">
                Sign up
              </Link>
            </Box>

          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
