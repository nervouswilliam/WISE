import React, { useEffect, useRef, useState } from 'react';
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
    Chip,
    useTheme,
    Link // <-- FIXED: Link component added here
} from "@mui/material";

// Icon Imports (replacing generic SVGs from the HTML file)
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // For WMS/Stock
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'; // For POS
import AutoGraphIcon from '@mui/icons-material/AutoGraph'; // For Sales Forecasting
import SmartToyIcon from '@mui/icons-material/SmartToy'; // For AI Assistant
import ContactsIcon from '@mui/icons-material/Contacts'; // For CRM
import GroupsIcon from '@mui/icons-material/Groups'; // For Team & Roles
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

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

// One card in the features grid - shared styling so all 6 stay visually consistent.
const FeatureCard = ({ icon, title, description, bullets, isNew, theme }) => (
    <Paper
        elevation={6}
        sx={{
            p: { xs: 3, sm: 4 },
            height: '100%',
            borderRadius: 3,
            borderTop: `4px solid ${PRIMARY_COLOR}`,
            position: 'relative',
            transition: '0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[12],
            },
        }}
    >
        {isNew && (
            <Chip
                label="New"
                size="small"
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: PRIMARY_COLOR,
                    color: 'white',
                    fontWeight: 700,
                }}
            />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {React.cloneElement(icon, { sx: { color: PRIMARY_COLOR, fontSize: 40, mr: 2 } })}
            <Typography variant="h5" component="h3" fontWeight={700}>
                {title}
            </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
            {description}
        </Typography>
        <List disablePadding>
            {bullets.map((b) => (
                <FeatureListItem key={b} text={b} />
            ))}
        </List>
    </Paper>
);


function LandingPage() {
    const navigate = useNavigate();
  const theme = useTheme();
  const [demoLoading, setDemoLoading] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroButtonsRef = useRef(null);

  // Shows a compact fixed bar with Login/Try Demo once the hero's own buttons have
  // scrolled out of view, so those actions stay reachable without scrolling back up.
  useEffect(() => {
    const handleScroll = () => {
      if (!heroButtonsRef.current) return;
      const { bottom } = heroButtonsRef.current.getBoundingClientRect();
      setShowStickyBar(bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    try {
      const token = await authService.login(
        import.meta.env.VITE_DEMO_EMAIL,
        import.meta.env.VITE_DEMO_PASSWORD
      );
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Demo login failed:", err);
      alert("Sorry, the live demo is temporarily unavailable. Please try again shortly.");
      setDemoLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: ACCENT_BG }}>

      {/* Sticky bar: appears once the hero's own Login/Try Demo buttons scroll out of view */}
      {showStickyBar && (
      <Paper
        elevation={4}
        square
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56, px: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="/loginLogo.png" alt="Wisely Logo" sx={{ backgroundColor: PRIMARY_COLOR, width: 28, height: 28, mr: 1.5 }} />
              <Typography variant="subtitle1" component="span" sx={{ fontWeight: 800, color: PRIMARY_COLOR, letterSpacing: 1.5 }}>
                Wisely
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: PRIMARY_COLOR,
                  borderColor: PRIMARY_COLOR,
                  '&:hover': { backgroundColor: PRIMARY_COLOR, color: 'white' },
                  borderRadius: 2,
                  fontWeight: 600,
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayCircleOutlineIcon />}
                disabled={demoLoading}
                sx={{
                  backgroundColor: PRIMARY_COLOR,
                  '&:hover': { backgroundColor: '#5a34a8' },
                  borderRadius: 2,
                  fontWeight: 600,
                }}
                onClick={handleTryDemo}
              >
                {demoLoading ? 'Loading...' : 'Try Live Demo'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>
      )}

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
          </Box>
        </Container>
      </Paper>

      {/* 2. Hero Section */}
      <Box sx={{ py: { xs: 8, md: 16 }, backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background glow - purely visual, no content */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: { xs: -180, md: -260 },
            right: { xs: -180, md: -160 },
            width: { xs: 360, md: 560 },
            height: { xs: 360, md: 560 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PRIMARY_COLOR}22 0%, ${PRIMARY_COLOR}00 70%)`,
            pointerEvents: 'none',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: { xs: -160, md: -220 },
            left: { xs: -160, md: -140 },
            width: { xs: 320, md: 480 },
            height: { xs: 320, md: 480 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${PRIMARY_COLOR}18 0%, ${PRIMARY_COLOR}00 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative' }}>
          <Chip
            icon={<SmartToyIcon sx={{ color: `${PRIMARY_COLOR} !important` }} />}
            label="Now with an AI business assistant"
            sx={{
              mb: 3,
              backgroundColor: `${PRIMARY_COLOR}14`,
              color: PRIMARY_COLOR,
              fontWeight: 700,
              px: 1,
              '& .MuiChip-icon': { color: PRIMARY_COLOR },
            }}
          />
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
            sx={{ mt: 2, mb: 4, maxWidth: 800, mx: 'auto', fontSize: { xs: '1.1rem', sm: '1.4rem' } }}
          >
            Wisely unifies your warehouse management, point of sale, customer relationships, and an AI assistant that knows your business into a single, efficient platform.
          </Typography>

          {/* At-a-glance highlight strip */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mb: 5 }}>
            {[
              { icon: <BoltIcon fontSize="small" />, label: 'Real-time inventory' },
              { icon: <SmartToyIcon fontSize="small" />, label: 'AI-powered insights' },
              { icon: <GroupIcon fontSize="small" />, label: 'Built for teams' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 5,
                  px: 1.75,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: '#fff',
                }}
              >
                <Box sx={{ display: 'flex', color: PRIMARY_COLOR }}>{item.icon}</Box>
                {item.label}
              </Box>
            ))}
          </Box>

          {/* Primary CTA Group */}
          <Box ref={heroButtonsRef} sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
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
            <Button
              variant="text"
              size="large"
              startIcon={<PlayCircleOutlineIcon />}
              disabled={demoLoading}
              sx={{
                color: PRIMARY_COLOR,
                fontWeight: 600,
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 }
              }}
              onClick={handleTryDemo}
            >
              {demoLoading ? "Loading Demo..." : "Try Live Demo"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 3. Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ textAlign: 'center', mb: 1.5 }}>
            Everything Your Business Needs, in One Place
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 8, maxWidth: 640, mx: 'auto' }}
          >
            From the warehouse floor to the checkout counter to your customer relationships -
            Wisely brings it all together, with an AI assistant that actually knows your data.
          </Typography>

          <Grid container spacing={4} alignItems="stretch">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                icon={<LocalShippingIcon />}
                title="Seamless Stock Management (WMS)"
                description="Say goodbye to manual counting and inventory errors. Wisely provides real-time visibility into your warehouse, giving you accurate stock levels at a glance."
                bullets={[
                  'Real-Time Inventory Tracking: Know what you have and where it is, instantly.',
                  'Low Stock Alerts: Automated notifications ensure you never miss a reorder point.',
                  'Reporting & Analytics: Generate detailed reports on stock turnover and valuation.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                icon={<PointOfSaleIcon />}
                title="Quick & Reliable Point of Sale (POS)"
                description="Process customer transactions quickly and accurately. Since your POS is linked directly to your WMS, every sale instantly updates your available stock."
                bullets={[
                  'Instant Stock Deduction: Eliminate manual adjustments after a sale.',
                  'Multi-Payment Options: Accept all major forms of payment effortlessly.',
                  'Transaction History: Maintain a flawless, searchable record of all sales.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                isNew
                icon={<SmartToyIcon />}
                title="AI Business Assistant"
                description="Get instant answers about your stock, sales, and trends - powered by AI and grounded in your real business data, not guesses."
                bullets={[
                  'Ask Anything: "What\'s low on stock?" or "How were sales this week?" - just ask.',
                  'Grounded in Real Data: Every answer is pulled straight from your actual inventory and sales records.',
                  'Available Everywhere: A floating assistant on every page, ready whenever you need it.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                isNew
                icon={<ContactsIcon />}
                title="Customer Relationship Management"
                description="Turn one-time buyers into repeat customers. Wisely keeps track of who's buying what, so you can build real relationships, not just transactions."
                bullets={[
                  'Customer Profiles: Store contact details and notes for every customer in one place.',
                  'Purchase History: See exactly what each customer has bought and how much they\'ve spent.',
                  'Quick Search: Find any customer by name, phone, or email in seconds.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                isNew
                icon={<GroupsIcon />}
                title="Team & Role-Based Access"
                description="Bring your whole team onboard without giving up control. Invite staff, assign roles, and decide exactly what each person can see and do."
                bullets={[
                  'Custom Roles: Cashier, purchasing, or manager - each sees only what\'s relevant to their job.',
                  'Simple Invites: Add a team member by email - they\'re in as soon as they sign up.',
                  'Stay in Control: You\'re always the owner; staff work within the access you grant them.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                icon={<AutoGraphIcon />}
                title="Smart Sales Forecasting"
                description="Stop guessing what to restock. Wisely looks at your recent sales trends and projects what's coming next, product by product, so you can plan ahead with confidence."
                bullets={[
                  'Demand Prediction: See projected revenue and units sold for the days ahead.',
                  'Per-Product Trends: Spot which items are trending up or down at a glance.',
                  'Smarter Restocking: Know how many days of stock you have left before you run out.',
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FeatureCard
                theme={theme}
                isNew
                icon={<UploadFileIcon />}
                title="Bulk Import & Migration"
                description="Switching from spreadsheets or another system? Bring your entire inventory and business history into Wisely in minutes - no manual re-entry required."
                bullets={[
                  'Inventory Import: Upload your existing product list from Excel - categories and suppliers are created automatically.',
                  'Historical Records: Import past sales and restocks so your reports are accurate from day one.',
                  'Safe by Design: Every row is validated and previewed before anything is imported, with duplicates automatically skipped.',
                ]}
              />
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