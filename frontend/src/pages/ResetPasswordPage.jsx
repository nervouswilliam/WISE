import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Your password has been successfully updated!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, width: "100%" }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#6f42c1", fontWeight: "bold" }}
          >
            Wisely
          </Typography>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Reset Your Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

          <Box component="form" onSubmit={handleReset}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                backgroundColor: "#6f42c1",
                "&:hover": { backgroundColor: "#5a35a0" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
