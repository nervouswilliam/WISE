import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockResetIcon from "@mui/icons-material/LockReset";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import authService from "../services/authService";
import productService from "../services/productService";

function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.whoami();
        setUser(response.user_metadata);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const countryCodes = [
    { code: "+62", country: "Indonesia" },
    { code: "+65", country: "Singapore" },
    { code: "+1", country: "USA" },
    { code: "+44", country: "UK" },
    { code: "+81", country: "Japan" },
    { code: "+86", country: "China" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await productService.addImageUrl(
        file,
        "profile_picture",
        "profilePic_" + Date.now()
      );
      if (imageUrl) {
        setUser((prev) => ({ ...prev, imageUrl }));
        alert("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateUser(user);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChange = async () => {
    setIsChangingEmail(true);
    try {
      await authService.changeEmail(newEmail);
      alert("Confirmation link sent to new email!");
    } catch (err) {
      console.error("Failed to change email:", err);
      setError("Failed to change email. Please try again.");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    try {
      await authService.resetPassword(user.email);
      alert("Password reset link sent to your email!");
    } catch (err) {
      console.error("Password reset failed:", err);
      alert("Failed to send reset link. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      try {
        await authService.deleteAccount();
        alert("Account deleted successfully.");
        window.location.href = "/";
      } catch (err) {
        console.error("Account deletion failed:", err);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#6f42c1" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="#6f42c1"
        textAlign="center"
        gutterBottom
      >
        Wisely Settings
      </Typography>

      {/* Profile Info */}
    <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3, p: 3 }}>
        <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon sx={{ color: "#6f42c1" }} />
            <Typography variant="h6" fontWeight="bold" color="#6f42c1">
                Profile Information
            </Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />

            {/* Profile Picture Centered */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
                src={user?.imageUrl || "/default-profile.png"}
                sx={{
                width: 130,
                height: 130,
                mb: 2,
                border: "4px solid #6f42c1",
                boxShadow: "0 4px 10px rgba(111, 66, 193, 0.3)",
                mx: "auto",
                }}
            />
            <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCameraIcon />}
                disabled={uploadingImage}
                sx={{
                backgroundColor: "#6f42c1",
                "&:hover": { backgroundColor: "#5a35a0" },
                borderRadius: "20px",
                px: 3,
                }}
            >
                {uploadingImage ? "Uploading..." : "Change Picture"}
                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            </Box>

            {/* Profile Fields */}
            <Box component="form" onSubmit={handleSave}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Username"
                    name="name"
                    value={user?.name || ""}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={user?.email || ""}
                    disabled
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Code</InputLabel>
                    <Select
                    name="countryCode"
                    value={user?.countryCode || ""}
                    label="Code"
                    onChange={handleChange}
                    >
                    {countryCodes.map((c) => (
                        <MenuItem key={c.code} value={c.code}>
                        {c.code} ({c.country})
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={user?.phoneNumber || ""}
                    onChange={handleChange}
                />
                </Grid>
            </Grid>
            <CardActions sx={{ justifyContent: "flex-end", mt: 2 }}>
                <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isSaving}
                sx={{
                    backgroundColor: "#6f42c1",
                    "&:hover": { backgroundColor: "#5a35a0" },
                    borderRadius: "20px",
                    px: 3,
                }}
                >
                {isSaving ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    "Save Changes"
                )}
                </Button>
            </CardActions>
            </Box>
        </CardContent>
    </Card>


      {/* Security */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SecurityIcon sx={{ color: "#6f42c1" }} />
            <Typography variant="h6" fontWeight="bold" color="#6f42c1">
              Security
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" mb={1}>
                Change Email Address
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={handleEmailChange}
                  disabled={isChangingEmail}
                  sx={{
                    borderColor: "#6f42c1",
                    color: "#6f42c1",
                    "&:hover": { backgroundColor: "#f2e8ff" },
                  }}
                  startIcon={<MailOutlineIcon />}
                >
                  {isChangingEmail ? "Sending..." : "Change Email"}
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body1" mb={1}>
                Reset Password
              </Typography>
              <Button
                variant="outlined"
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
                startIcon={<LockResetIcon />}
                sx={{
                  borderColor: "#6f42c1",
                  color: "#6f42c1",
                  "&:hover": { backgroundColor: "#f2e8ff" },
                }}
              >
                {isResettingPassword ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsActiveIcon sx={{ color: "#6f42c1" }} />
            <Typography variant="h6" fontWeight="bold" color="#6f42c1">
              Notifications
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                sx={{ color: "#6f42c1" }}
              />
            }
            label="Enable in-app notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            }
            label="Enable email notifications"
          />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card
        sx={{
          border: "1px solid #f5c2c7",
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: "#fff0f0",
        }}
      >
        <CardContent>
          <Typography variant="h6" color="error" fontWeight="bold" gutterBottom>
            Danger Zone
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography mb={2}>
            Deleting your account is permanent. All your data will be lost.
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SettingsPage;
