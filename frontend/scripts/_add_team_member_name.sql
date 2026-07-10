-- Adds `name` and `avatar_url` columns to team_members, populated when a member
-- accepts their invite (see teamService.acceptPendingInviteIfAny). Existing pending
-- invites and members who joined before this migration will show blank until they
-- next log in and re-accept is not re-triggered - these only backfill on new accepts.
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS avatar_url text;
