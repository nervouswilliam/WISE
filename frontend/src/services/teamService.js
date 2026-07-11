import { supabase } from '../supabaseClient';
import profileService from './profileService';

// Team members (staff) linked to an owner's business. See scripts/*team_members*.sql for
// the table + RLS policies this depends on.

const getTeamMembers = async (ownerAuthId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select()
    .eq('owner_id', ownerAuthId)
    .order('invited_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  // Name/picture live in profiles (the single source of truth - see
  // scripts/_add_profiles_table.sql), keyed by member_user_id, not on team_members itself.
  const memberIds = data.map((m) => m.member_user_id).filter(Boolean);
  const profiles = await profileService.getProfiles(memberIds);
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));

  return data.map((m) => ({
    ...m,
    name: profileById[m.member_user_id]?.name || null,
    avatar_url: profileById[m.member_user_id]?.avatar_url || null,
  }));
};

const inviteMember = async (email, role, ownerAuthId) => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{ owner_id: ownerAuthId, email, role, status: 'pending' }])
    .select();

  if (error) {
    console.error('Error inviting team member:', error);
    throw error;
  }
  return data;
};

const revokeMember = async (id, ownerAuthId) => {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)
    .eq('owner_id', ownerAuthId);

  if (error) {
    console.error('Error revoking team member:', error);
    throw error;
  }
};

// Called once per login (see App.jsx). Looks for a pending invite addressed to this
// person's own verified email and, if found, links it to their auth id.
const acceptPendingInviteIfAny = async (authId, email) => {
  if (!email) return null;

  const { data: pending, error: findError } = await supabase
    .from('team_members')
    .select()
    .eq('email', email)
    .is('member_user_id', null)
    .eq('status', 'pending')
    .maybeSingle();

  if (findError || !pending) return null;

  const { data, error } = await supabase
    .from('team_members')
    .update({ member_user_id: authId, status: 'active', joined_at: new Date().toISOString() })
    .eq('id', pending.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error accepting team invite:', error);
    return null;
  }
  return data;
};

// Called once per login. If this person is active staff on someone else's business,
// returns that owner's auth id + this person's role; otherwise null (they're an owner).
const getActiveMembership = async (authId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select()
    .eq('member_user_id', authId)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) return null;
  return data;
};

export default {
  getTeamMembers,
  inviteMember,
  revokeMember,
  acceptPendingInviteIfAny,
  getActiveMembership,
};
