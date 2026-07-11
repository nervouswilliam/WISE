-- Replaces the team_members.name/avatar_url copy-and-sync approach with a single
-- source of truth: one profiles row per auth user, readable by anyone in the same
-- business. This is why Instagram/Facebook profile pictures "just work" everywhere -
-- there's no copy to keep in sync, everything else looks it up live by user id.
--
-- Previously we copied name/avatar_url into team_members at invite-accept time, then
-- tried to re-sync it on every login. That needed RLS to allow repeated self-updates
-- on an already-claimed row, which it didn't, and even once fixed, was always at best
-- "current as of your last login" rather than actually current.

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Can the caller see this profile? Yes if it's their own, or if they and the target
-- are in the same business (either direction: target is my owner, target is my staff,
-- or target is a co-worker under the same owner as me). SECURITY DEFINER so the
-- internal team_members lookups bypass RLS, same reasoning as is_active_team_member()
-- in _add_customers_table.sql.
CREATE OR REPLACE FUNCTION public.can_view_profile(target_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() = target_id
    OR EXISTS ( -- target is my owner
      SELECT 1 FROM team_members
      WHERE member_user_id = auth.uid() AND status = 'active' AND owner_id = target_id
    )
    OR EXISTS ( -- target is my staff (I'm the owner)
      SELECT 1 FROM team_members
      WHERE owner_id = auth.uid() AND status = 'active' AND member_user_id = target_id
    )
    OR EXISTS ( -- target is a co-worker under the same owner as me
      SELECT 1 FROM team_members me
      JOIN team_members them ON them.owner_id = me.owner_id
      WHERE me.member_user_id = auth.uid() AND me.status = 'active'
        AND them.member_user_id = target_id AND them.status = 'active'
    );
$$;

GRANT EXECUTE ON FUNCTION public.can_view_profile(uuid) TO authenticated;

CREATE POLICY "Business members can view each other's profiles"
  ON profiles FOR SELECT
  USING (can_view_profile(id));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up, from whatever they submitted
-- on the signup form (see authService.signup) - no client-side capture logic needed.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'imageUrl')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill everyone who signed up before this migration existed (this immediately
-- fixes name/avatar for any already-active team member, no re-login required).
INSERT INTO public.profiles (id, name, avatar_url)
SELECT id, raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'imageUrl'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- The old copy-and-sync columns/function are no longer used.
ALTER TABLE team_members DROP COLUMN IF EXISTS name;
ALTER TABLE team_members DROP COLUMN IF EXISTS avatar_url;
DROP FUNCTION IF EXISTS sync_team_member_profile(text, text);
