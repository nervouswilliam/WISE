import React from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    Button, 
    Paper, 
    Grid, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    useTheme,
    Link // <-- FIXED: Link component added here
} from "@mui/material";

// Icon Imports (replacing generic SVGs from the HTML file)
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // For WMS/Stock
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'; // For POS
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

// --- Theme and Color Configuration ---
const PRIMARY_COLOR = '#6f42c1'; // Wisely Purple
const ACCENT_BG = '#f7f7f9'; // Light background color

// Wisely Logo Component (using the SVG structure provided earlier)
const WiselyLogo = () => (
    <Box sx={{ width: 32, height: 32, mr: 1.5 }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Circular Background */}
            <circle cx="50" cy="50" r="50" fill={PRIMARY_COLOR}/>
            {/* Stylized 'W' shape */}
            <path
                fill="white"
                d="M25 70 L35 30 L40 30 L50 65 L60 30 L65 30 L75 70 L68 70 L60 45 L50 70 L40 45 L32 70 Z"
            />
        </svg>
    </Box>
);


const FeatureListItem = ({ text }) => {
    // FIXED: Simplified logic to robustly split and bold the first part
    const parts = text.split(':');
    const boldPart = parts[0];
    // Re-join the rest in case the description contained colons
    const rest = parts.slice(1).join(':'); 

    return (
        <ListItem disablePadding sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 35 }}>
                <CheckIcon sx={{ color: PRIMARY_COLOR }} fontSize="small" />
            </ListItemIcon>
            <ListItemText>
                <Typography variant="body1">
                    <Typography component="span" fontWeight="bold">{boldPart}:</Typography>
                    {rest}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};


function LandingPage() {
    const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: ACCENT_BG }}>
      
      {/* 1. Navigation Bar */}
      <Paper elevation={2} square>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64, px: { xs: 2, sm: 0 } }}>
            {/* Logo and Branding */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="img" src="/loginLogo.png" alt="Wisely Logo" sx={{ backgroundColor: PRIMARY_COLOR,  width: 32, height: 32, mr: 1.5 }} />
                <Typography variant="h6" component="span" sx={{ fontWeight: 800, color: PRIMARY_COLOR, letterSpacing: 1.5 }}>
                    Wisely
                </Typography>
            </Box>
            
            {/* CTA Button */}
            <Button 
                variant="contained" 
                sx={{ 
                    backgroundColor: PRIMARY_COLOR,
                    '&:hover': { backgroundColor: '#5a34a8' },
                    borderRadius: 2,
                    display: { xs: 'none', md: 'inline-flex' } // Hidden on mobile
                }}
                onClick={() => navigate('/login')}
            >
                Login
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* 2. Hero Section */}
      <Box sx={{ py: { xs: 8, md: 16 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight={900} 
            gutterBottom 
            sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }, mb: 3 }}
          >
            Manage Stock. Close Sales. 
            <Box component="span" sx={{ color: PRIMARY_COLOR }}> All in One App.</Box>
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mt: 2, mb: 5, maxWidth: 800, mx: 'auto', fontSize: { xs: '1.1rem', sm: '1.4rem' } }}
          >
            Wisely unifies your warehouse management system (WMS) and point of sale (POS) into a single, efficient platform, helping you keep track of every unit and every transaction.
          </Typography>
          
          {/* Primary CTA Group */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<KeyboardArrowRightIcon />}
              sx={{ 
                backgroundColor: PRIMARY_COLOR,
                '&:hover': { backgroundColor: '#5a34a8', transform: 'scale(1.02)' },
                borderRadius: 3,
                boxShadow: `0 10px 20px rgba(111, 66, 193, 0.4)`,
                fontWeight: 600,
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 6 }
              }}
              onClick={() => navigate("/signup")}
            >
              Get Started Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                '&:hover': { backgroundColor: PRIMARY_COLOR, color: 'white' },
                borderRadius: 3,
                fontWeight: 600,
                py: { xs: 1.5, sm: 2 },
                px: { xs: 4, sm: 6 }
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 3. Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ textAlign: 'center', mb: 8 }}>
            The Power of Unified Retail Operations
          </Typography>
          
          <Grid container spacing={4}>
            
            {/* Feature 1: Stock Management (WMS) */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: { xs: 3, sm: 5 }, 
                  borderRadius: 3, 
                  borderTop: `4px solid ${PRIMARY_COLOR}`,
                  transition: '0.3s',
                  '&:hover': { 
                      transform: 'translateY(-5px)', 
                      boxShadow: theme.shadows[12] 
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon sx={{ color: PRIMARY_COLOR, fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Seamless Stock Management (WMS)
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Say goodbye to manual counting and inventory errors. Wisely provides real-time visibility into your warehouse or storage facility, giving you accurate stock levels at a glance.
                </Typography>
                <List disablePadding>
                    <FeatureListItem text="Real-Time Inventory Tracking: Know what you have and where it is, instantly." />
                    <FeatureListItem text="Low Stock Alerts: Automated notifications ensure you never miss a reorder point." />
                    <FeatureListItem text="Reporting & Analytics: Generate detailed reports on stock turnover and valuation." />
                </List>
              </Paper>
            </Grid>
            
            {/* Feature 2: Point of Sale (POS) */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: { xs: 3, sm: 5 }, 
                  borderRadius: 3, 
                  borderTop: `4px solid ${PRIMARY_COLOR}`,
                  transition: '0.3s',
                  '&:hover': { 
                      transform: 'translateY(-5px)', 
                      boxShadow: theme.shadows[12] 
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PointOfSaleIcon sx={{ color: PRIMARY_COLOR, fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h3" fontWeight={700}>
                    Quick & Reliable Point of Sale (POS)
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Process customer transactions quickly and accurately. Since your POS is linked directly to your WMS, every sale instantly updates your available stock.
                </Typography>
                <List disablePadding>
                    <FeatureListItem text="Instant Stock Deduction: Eliminate manual adjustments after a sale." />
                    <FeatureListItem text="Multi-Payment Options: Accept all major forms of payment effortlessly." />
                    <FeatureListItem text="Transaction History: Maintain a flawless, searchable record of all sales." />
                </List>
              </Paper>
            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* 4. Final Call to Action Section */}
      <Box 
        sx={{ 
            backgroundColor: PRIMARY_COLOR, 
            py: { xs: 8, md: 10 }, 
            borderTopLeftRadius: { xs: 0, md: 50 },
            borderTopRightRadius: { xs: 0, md: 50 },
            textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" color="white" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '2rem', sm: '3rem' } }}>
            Ready to Optimize Your Business?
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9, mb: 4 }}>
            Join thousands of businesses simplifying their stock and sales with Wisely.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
                backgroundColor: 'white', 
                color: PRIMARY_COLOR,
                fontWeight: 700,
                borderRadius: 3,
                px: { xs: 8, sm: 10 },
                py: 1.5,
                fontSize: '1.25rem',
                '&:hover': { 
                    backgroundColor: '#f0f0f0', 
                    transform: 'scale(1.05)' 
                }
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up for Free Today
          </Button>
        </Container>
      </Box>

      {/* 5. Footer */}
      <Box sx={{ backgroundColor: '#212121', py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="#bdbdbd">
            &copy; 2025 Wisely. All rights reserved. | 
            <Link href="/privacy-policy" color="inherit" sx={{ ml: 1, '&:hover': { color: 'white' } }}>Privacy Policy</Link> | 
            <Link href="/terms-of-service" color="inherit" sx={{ ml: 1, '&:hover': { color: 'white' } }}>Terms of Service</Link>
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}

export default LandingPage;