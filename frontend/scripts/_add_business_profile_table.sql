-- Per-business branding (company name + logo), shown in the top bar for the owner
-- and their staff alike. Keyed by owner_id (the same "business id" used everywhere
-- else in the app - user.id for an owner, membership.owner_id for staff).
--
-- This can't live in the owner's own auth user_metadata (like their personal name/
-- picture do) because staff need to read it too, and a user's auth metadata is only
-- readable by that user themselves.

CREATE TABLE business_profile (
  owner_id uuid PRIMARY KEY,
  business_name text,
  logo_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_profile ENABLE ROW LEVEL SECURITY;

-- Reuses is_active_team_member() from scripts/_add_customers_table.sql.

CREATE POLICY "Owners and staff can view business profile"
  ON business_profile FOR SELECT
  USING (auth.uid() = owner_id OR is_active_team_member(owner_id));

-- Branding is an owner-level decision - staff can see it, only the owner can change it.
CREATE POLICY "Owners can insert their business profile"
  ON business_profile FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their business profile"
  ON business_profile FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
