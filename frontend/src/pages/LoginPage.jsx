import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  Container
} from "@mui/material";
import authService from "../services/authService";

function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(name, password);
      console.log(data)
      localStorage.setItem("token", data);
      localStorage.setItem("isAuthenticated", "true");
      // navigate("/dashboard");
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Full width container for split layout */}
        <Box sx={{ display: 'flex', width: '100%', height: '400px', mt: 4 }}>
          {/* Left side: Illustration */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#6f42c1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/loginPicture.png"/>
          </Box>
          {/* Right side: Login Form */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome Back
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Username"
                name="name"
                autoComplete="name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                
                sx={{ mt: 3, mb: 2 , backgroundColor:"#6f42c1"}}
              >
                Sign In
              </Button>
              <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                <Typography variant="body2" mr={1}>
                  Don't have an account?
                </Typography>
                <Link href="/signup" color="#6f42c1" underline="hover">
                  Sign up
                </Link>
              </Box>

            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
