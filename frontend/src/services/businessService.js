import { supabase } from '../supabaseClient';

// Per-business branding (company name + logo). See scripts/_add_business_profile_table.sql
// for the table + RLS policies this depends on - owner_id is the same "business id"
// used everywhere else in the app.

const getBusinessProfile = async (ownerId) => {
  const { data, error } = await supabase
    .from('business_profile')
    .select()
    .eq('owner_id', ownerId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
  return data;
};

const upsertBusinessProfile = async (ownerId, { businessName, logoUrl }) => {
  const { data, error } = await supabase
    .from('business_profile')
    .upsert({ owner_id: ownerId, business_name: businessName, logo_url: logoUrl, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving business profile:', error);
    throw error;
  }
  return data;
};

export default {
  getBusinessProfile,
  upsertBusinessProfile,
};
