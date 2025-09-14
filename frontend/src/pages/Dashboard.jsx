import { Box, Typography, Paper, Grid } from "@mui/material";

export default function Dashboard({user}) {
  return (
    <Box>
      {/* Welcome Text */}
      <Typography variant="h5" gutterBottom>
        Welcome back, {user.username} 👋
      </Typography>

      {/* Quick Stats Section */}
      <Grid container spacing={2} sx={{width:"100%"}}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Products</Typography>
            <Typography variant="h6">120</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Suppliers</Typography>
            <Typography variant="h6">15</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Sales Today</Typography>
            <Typography variant="h6">$1237</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Products in Process</Typography>
            <Typography variant="h6">8</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Placeholder for future charts/tables */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, height: 300 }}>
          <Typography variant="body1">Sales Analytics</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
