import { supabase } from '../supabaseClient';

// The single source of truth for a user's name/picture (see scripts/_add_profiles_table.sql).
// Anyone in the same business can read anyone else's profile; only the owner of a
// profile can write it (via their own auth-provided identity, not a passed id).

const getProfiles = async (userIds) => {
  if (!userIds || userIds.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .in('id', userIds);

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data;
};

const upsertOwnProfile = async (authId, { name, avatarUrl }) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: authId, name, avatar_url: avatarUrl, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export default {
  getProfiles,
  upsertOwnProfile,
};
