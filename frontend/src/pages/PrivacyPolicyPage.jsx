import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Paper,
  Link,
} from "@mui/material";

const PrivacyPolicyPage = () => {
  return (
    <Box sx={{ bgcolor: "#f9f7ff", minHeight: "100vh", py: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "#6f42c1",
          color: "white",
          py: 6,
          textAlign: "center",
          mb: 6,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Wisely Privacy Policy
        </Typography>
        <Typography variant="subtitle1">
          Last updated: November 2025
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "white",
          }}
        >
          <Typography variant="body1" paragraph>
            Welcome to <strong>Wisely</strong>! Your privacy is extremely
            important to us. This Privacy Policy explains how we collect, use,
            share, and protect your personal information when you use our
            platform and services.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Section 1 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 2 }}
            gutterBottom
          >
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information to help us provide and improve Wisely’s
            services. This includes:
          </Typography>
          <ul>
            <li>Your name, email address, and contact details</li>
            <li>Account credentials and usage preferences</li>
            <li>Device and browser data for optimization</li>
            <li>Activity information, such as pages visited</li>
          </ul>

          {/* Section 2 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            Wisely uses your information to:
          </Typography>
          <ul>
            <li>Operate, maintain, and improve our services</li>
            <li>Provide personalized user experiences</li>
            <li>Communicate updates, support, or alerts</li>
            <li>Ensure security and prevent unauthorized activity</li>
          </ul>

          {/* Section 3 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            3. Sharing of Information
          </Typography>
          <Typography variant="body1" paragraph>
            Wisely does <strong>not sell</strong> or rent your personal
            information. We may share data only with:
          </Typography>
          <ul>
            <li>Trusted partners that support our operations</li>
            <li>Legal authorities when required by law</li>
            <li>Parties involved in fraud prevention or investigation</li>
          </ul>

          {/* Section 4 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            4. Data Protection and Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement advanced security measures to protect your personal
            data. However, no online system is completely secure — please use
            caution when sharing sensitive information.
          </Typography>

          {/* Section 5 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have full control over your data. You can request access,
            modification, or deletion of your personal information by
            contacting:
          </Typography>
          <Typography variant="body1" color="primary">
            <Link href="mailto:support@wisely.com" underline="hover">
              support@wisely.com
            </Link>
          </Typography>

          {/* Section 6 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            6. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            Wisely uses cookies and similar tools to personalize your
            experience, analyze trends, and improve our services. You can manage
            cookies through your browser settings.
          </Typography>

          {/* Section 7 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            7. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. When we do, we
            will post the updated version here with a new “Last Updated” date.
          </Typography>

          {/* Section 8 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            8. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions, feedback, or privacy concerns, please
            reach out to us at:
          </Typography>
          <Typography variant="body1" color="primary">
            <Link href="mailto:support@wisely.com" underline="hover">
              support@wisely.com
            </Link>
          </Typography>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 5 }}
        >
          © {new Date().getFullYear()} Wisely. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;
