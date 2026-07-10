import { supabase } from '../supabaseClient';

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
  return data;
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
const acceptPendingInviteIfAny = async (authId, email, name, avatarUrl) => {
  if (!email) return null;

  const { data: pending, error: findError } = await supabase
    .from('team_members')
    .select()
    .eq('email', email)
    .is('member_user_id', null)
    .eq('status', 'pending')
    .maybeSingle();

  if (findError || !pending) return null;

  // team_members has no way to look up a member's name/picture on its own (those live in
  // their auth metadata, which we can only read as themselves) - so capture them here,
  // once, while they're accepting their own invite.
  const { data, error } = await supabase
    .from('team_members')
    .update({
      member_user_id: authId,
      status: 'active',
      joined_at: new Date().toISOString(),
      name,
      avatar_url: avatarUrl,
    })
    .eq('id', pending.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error accepting team invite:', error);
    return null;
  }
  return data;
};

// Called every login (see App.jsx), for anyone already active staff somewhere. Keeps
// team_members.name/avatar_url in sync with whatever they currently have set in their
// own auth metadata, since acceptPendingInviteIfAny only captures it once (at accept
// time) and has no way to see later changes made via Settings.
const syncOwnProfile = async (authId, name, avatarUrl) => {
  if (!authId) return;

  const { error } = await supabase
    .from('team_members')
    .update({ name, avatar_url: avatarUrl })
    .eq('member_user_id', authId)
    .eq('status', 'active');

  if (error) {
    console.error('Error syncing profile to team_members:', error);
  }
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
  syncOwnProfile,
  getActiveMembership,
};
