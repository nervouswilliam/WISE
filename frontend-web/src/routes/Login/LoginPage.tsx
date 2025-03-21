import { useContext, useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Container, Grid, CardMedia, Box } from '@mui/material';
import warehouseImg from '../../assets/warehouseImage.png';
import { apiService } from '../api';
import { AuthContext } from '../../context/AuthContext';
import { User } from '../../models/User';
import { useNavigate } from 'react-router-dom';
// import { useNotification } from '../helper/NotificationProvider';

export default function Login() {
  const {login, setUserData} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!username) {
      newErrors.username = 'Email is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const navigate = useNavigate();
  // const {showNotification} = useNotification();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login successful:', { username, password });
      // Perform login API call here
      const response = await apiService.post<{"session-id":string}>("/auth/login", {"name": username, "password": password});
      const output_schema_login = response?.output_schema;
      const error_code_login = response?.error_schema.error_code;
      if(error_code_login === "S001" && output_schema_login){
        login(output_schema_login["session-id"]);
      }
      const response2 = await apiService.get<User>("auth/who-am-i");
      const output_schema_user = response2?.output_schema;
      const error_code_user = response2?.error_schema.error_code;
      if(error_code_user === "S001" && output_schema_user){
        setUserData(output_schema_user)
      }

      if(error_code_login === "S001" && error_code_user === "S001"){
        // showNotification("Login Successful", "success");
        navigate("/dashboard");
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={8}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
          <Grid container spacing={2} alignItems="center">
            {/* Left Side - Image */}
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                sx={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                image={warehouseImg}
                alt="Warehouse"
              />
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6}>
              <CardContent>
                <Typography variant="h5" gutterBottom align="center" sx={{color:"#7142B0", fontFamily: "Quicksand, sans-serif", fontWeight: "700"}}>
                  Welcome Back
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor:"#7142B0" }}>
                    Login
                  </Button>
                </form>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
}
