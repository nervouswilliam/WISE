import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import teamService from '../services/teamService';
import DynamicTable from '../components/DynamicTable';
import Loading from '../components/loading';

const ROLES = ['manager', 'cashier', 'purchasing'];
const VIEW_MODE_STORAGE_KEY = 'teamViewMode';
const PRIMARY_COLOR = '#6f42c1';

function TeamPage({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('cashier');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem(VIEW_MODE_STORAGE_KEY) || 'table'
  );

  // Owners always manage the team; managers can too. Cashiers/purchasing can't.
  const canManageTeam = !user.isStaff || user.role === 'manager';

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // user.id is the *effective* business id (the real owner's, even for a manager
      // logged in as staff) - always use this, never user.authId, when talking to
      // team_members, so a manager's actions apply to the owner's team, not their own.
      const data = await teamService.getTeamMembers(user.id);
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageTeam) fetchMembers();
  }, [user]);

  const handleInvite = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (members.some((m) => m.email === email && m.status !== 'revoked')) {
      alert('This email already has a pending or active invite.');
      return;
    }
    setInviting(true);
    try {
      await teamService.inviteMember(email, role, user.id);
      setEmail('');
      setRole('cashier');
      await fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to send invite. Please try again.');
    } finally {
      setInviting(false);
    }
  };

  const handleRevoke = async (row) => {
    const confirmed = window.confirm(`Remove ${row.email} from your team?`);
    if (!confirmed) return;
    try {
      await teamService.revokeMember(row.id, user.id);
      await fetchMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to remove team member. Please try again.');
    }
  };

  const handleViewModeChange = (e, newMode) => {
    if (!newMode) return;
    setViewMode(newMode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, newMode);
  };

  if (!canManageTeam) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          Only the business owner or a manager can manage the team. You're signed in as a {user.role}.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Team</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Invite a Team Member</Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                  {ROLES.map((r) => (
                    <MenuItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleInvite}
                disabled={inviting}
                sx={{ height: '100%', backgroundColor: '#6f42c1', '&:hover': { backgroundColor: '#5a34a8' } }}
              >
                {inviting ? 'Inviting...' : 'Invite'}
              </Button>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            They'll get access as soon as they sign up (or next log in) with this exact email address.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: members.length === 0 ? 0 : 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="cards" aria-label="card view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {members.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No team members yet. Invite someone above to get started.
            </Typography>
          ) : viewMode === 'table' ? (
            <DynamicTable
              columns={[
                {
                  field: 'name',
                  label: 'Name',
                  render: (v, row) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={row._raw.avatar_url || undefined} sx={{ width: 28, height: 28, backgroundColor: PRIMARY_COLOR, fontSize: 14 }}>
                        {(row._raw.name || row._raw.email).charAt(0).toUpperCase()}
                      </Avatar>
                      {v}
                    </Box>
                  ),
                },
                { field: 'email', label: 'Email' },
                { field: 'role', label: 'Role', render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
                {
                  field: 'status',
                  label: 'Status',
                  render: (v) => (
                    <Chip
                      size="small"
                      label={v.charAt(0).toUpperCase() + v.slice(1)}
                      color={v === 'active' ? 'success' : v === 'pending' ? 'warning' : 'default'}
                    />
                  ),
                },
                { field: 'invited_at', label: 'Invited' },
              ]}
              rows={members.map((m) => ({
                id: m.id,
                name: m.name || '—',
                email: m.email,
                role: m.role,
                status: m.status,
                invited_at: new Date(m.invited_at).toLocaleDateString('id-ID'),
                _raw: m,
              }))}
              actions={(row) => (
                <IconButton size="small" color="error" onClick={() => handleRevoke(row._raw)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            />
          ) : (
            <Grid container spacing={2}>
              {members.map((m) => (
                <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar src={m.avatar_url || undefined} sx={{ backgroundColor: PRIMARY_COLOR }}>
                          {(m.name || m.email).charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap title={m.name || m.email}>
                            {m.name || m.email}
                          </Typography>
                          {m.name && (
                            <Typography variant="body2" color="text.secondary" noWrap title={m.email}>
                              {m.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                        <Chip
                          size="small"
                          label={m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                          color={m.status === 'active' ? 'success' : m.status === 'pending' ? 'warning' : 'default'}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Invited {new Date(m.invited_at).toLocaleDateString('id-ID')}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                      <IconButton size="small" color="error" onClick={() => handleRevoke(m)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default TeamPage;
