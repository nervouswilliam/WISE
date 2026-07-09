import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DashboardGrid from '../dashboard/DashboardGrid';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function DashboardPage({ user }) {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {getGreeting()}{user?.name ? `, ${user.name}` : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your business on{' '}
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
        </Typography>
      </Box>

      <DashboardGrid user={user} />
    </Container>
  );
}

export default DashboardPage;
