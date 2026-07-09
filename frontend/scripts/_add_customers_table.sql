-- CRM layer: a customers table + linking sales to a customer.
-- Run this once in the Supabase SQL editor.

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  country_code text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Reusable check: is the caller an active staff member of this owner's business?
-- SECURITY DEFINER so the internal team_members lookup bypasses RLS - querying
-- team_members from inside a policy that could itself apply to team_members is what
-- caused the "infinite recursion" bug fixed earlier for the team page; this sidesteps
-- the same trap for every other business table that needs owner-or-staff access.
CREATE OR REPLACE FUNCTION public.is_active_team_member(p_owner_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.owner_id = p_owner_id
      AND tm.member_user_id = auth.uid()
      AND tm.status = 'active'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_active_team_member(uuid) TO authenticated;

CREATE POLICY "Owners and staff can view customers"
  ON customers FOR SELECT
  USING (auth.uid() = user_id OR is_active_team_member(user_id));

CREATE POLICY "Owners and staff can insert customers"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_active_team_member(user_id));

CREATE POLICY "Owners and staff can update customers"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id OR is_active_team_member(user_id))
  WITH CHECK (auth.uid() = user_id OR is_active_team_member(user_id));

CREATE POLICY "Owners and staff can delete customers"
  ON customers FOR DELETE
  USING (auth.uid() = user_id OR is_active_team_member(user_id));

-- Link sales to a customer (nullable - existing/anonymous sales stay untouched).
ALTER TABLE transactions ADD COLUMN customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;
