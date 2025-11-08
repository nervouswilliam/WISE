import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Paper,
  Link,
} from "@mui/material";

const TermsOfServicePage = () => {
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
          Wisely Terms of Service
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
            Welcome to <strong>Wisely</strong>! By using our platform, you agree
            to the following Terms of Service (“Terms”). Please read them
            carefully before accessing or using our website or applications.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Section 1 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 2 }}
            gutterBottom
          >
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using Wisely’s services, you confirm that you have
            read, understood, and agree to be bound by these Terms. If you do
            not agree, please do not use the platform.
          </Typography>

          {/* Section 2 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            2. Use of Services
          </Typography>
          <Typography variant="body1" paragraph>
            Wisely provides tools and features to help businesses manage and
            optimize their operations. You agree to use the services only for
            lawful purposes and in accordance with these Terms.
          </Typography>
          <Typography variant="body1" paragraph>
            You must not:
          </Typography>
          <ul>
            <li>Use Wisely in a way that violates any laws or regulations.</li>
            <li>Attempt to access data or systems without authorization.</li>
            <li>Reverse engineer or modify our software.</li>
            <li>Use the platform for fraudulent or misleading activities.</li>
          </ul>

          {/* Section 3 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            3. Account Responsibilities
          </Typography>
          <Typography variant="body1" paragraph>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account. If
            you suspect unauthorized use, notify us immediately at{" "}
            <Link href="mailto:support@wisely.com" underline="hover">
              support@wisely.com
            </Link>
            .
          </Typography>

          {/* Section 4 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            4. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content, branding, and software associated with Wisely are the
            exclusive property of Wisely and its licensors. You may not copy,
            distribute, or create derivative works without prior written consent
            from us.
          </Typography>

          {/* Section 5 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            5. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to suspend or terminate your access to Wisely
            at any time if we believe you have violated these Terms or engaged
            in harmful behavior. Upon termination, your right to use our
            services will cease immediately.
          </Typography>

          {/* Section 6 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            Wisely is provided “as is” and “as available.” We are not liable for
            any direct, indirect, incidental, or consequential damages arising
            from your use of our platform, except where prohibited by law.
          </Typography>

          {/* Section 7 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            7. Changes to These Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We may update or revise these Terms from time to time. The most
            current version will always be available on our website. By
            continuing to use Wisely after any changes, you accept the revised
            Terms.
          </Typography>

          {/* Section 8 */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#6f42c1", mt: 4 }}
            gutterBottom
          >
            8. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For any questions or concerns regarding these Terms, please contact
            us at:
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

export default TermsOfServicePage;