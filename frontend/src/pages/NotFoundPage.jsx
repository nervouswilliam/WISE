import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material"; // Import Stack for button layout
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home"; // Import Home icon
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  // Mock navigation functions for a single-file preview environment
  const handleGoBack = () => {
    navigate(-1);
    console.log("Go Back action simulated.");
  };

  const handleGoHome = () => {
    navigate("/dashboard");
    console.log("Go Home action simulated.");
  };

  // Define common button styles using a reusable object
  const buttonStyle = {
    bgcolor: "white",
    color: "#6f42c1",
    fontWeight: "bold",
    px: 3, // Slightly reduced horizontal padding
    py: 1.2, // Slightly reduced vertical padding
    borderRadius: 25, // Make them pill-shaped
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)", // Add a subtle shadow
    transition: "transform 0.2s",
    "&:hover": { 
      bgcolor: "#f0e6ff", 
      transform: "scale(1.02)" 
    },
    "&:active": {
      transform: "scale(0.98)"
    }
  };

  return (
    <Box
      role="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#6f42c1",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        py: 4,
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 600, zIndex: 1 }}> {/* Content container */}
        {/* 404 Number */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", sm: "8rem", md: "10rem" }, // Larger font size for impact
            fontWeight: 800, // Extra bold
            mb: 1,
            lineHeight: 1,
            textShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          404
        </Typography>

        {/* Message */}
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            fontWeight: 600,
            mb: 2,
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            px: { xs: 2, sm: 4 },
            maxWidth: 500,
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          The page you’re looking for might have been removed, renamed, or doesn’t
          exist anymore. Don’t worry, you can find your way back.
        </Typography>

        {/* Buttons Stack */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={6}>
          {/* Go Back Button (primary action) */}
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={buttonStyle}
          >
            Go Back
          </Button>
          
          {/* Go Home Button (secondary action) */}
          <Button
            variant="outlined" // Outlined variant for visual distinction
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
                ...buttonStyle, // Inherit styles
                bgcolor: "transparent",
                color: "white",
                border: "2px solid white",
                "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "#f0e6ff",
                    transform: "scale(1.02)",
                },
            }}
          >
            Go Home
          </Button>
        </Stack>

        {/* GIF - Centered with mx: 'auto' */}
        <Box
          component="img"
          src="https://assets.dochipo.com/editor/animations/404-error/b6463d8b-ac87-42a7-ad59-6584a19a77a8.gif"
          alt="404 Illustration of a cloud with rain, symbolizing an error"
          sx={{
            width: { xs: "100%", sm: "90%", md: "60%" },
            maxWidth: 450,
            mx: 'auto', // FIX: Added margin-left and margin-right auto to center the element
            borderRadius: 3,
            border: "5px solid rgba(255,255,255,0.4)",
            boxShadow: 8,
            mb: 6,
            objectFit: 'cover'
          }}
        />

        {/* Footer - Ensures text alignment is centered */}
        {/* <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.8, 
            mt: 4,
            width: '100%', // Ensure it spans the container width
            textAlign: 'center' // Explicitly center the text
          }}
        >
          © {new Date().getFullYear()} <strong>Wisely</strong>. All rights reserved.
        </Typography> */}
      </Box>
    </Box>
  );
}