-- syncOwnProfile (teamService.js) needs to update name/avatar_url on an already-active
-- team_members row (member_user_id already set). The existing RLS policy on team_members
-- apparently only allows a member to touch their row once, at claim-time (member_user_id
-- transitioning from NULL to their own id) - a plain client-side UPDATE against an
-- already-claimed row silently affects 0 rows (RLS filters it out; Postgres does not
-- error on this).
--
-- Rather than loosen that policy (which would let a member self-edit any column, including
-- role/status), this function runs as its owner (bypassing RLS) but is narrowly scoped:
-- it can only ever set name/avatar_url on the row matching the caller's own auth.uid(),
-- and only while that row is active.
create or replace function sync_team_member_profile(new_name text, new_avatar_url text)
returns void
language sql
security definer
set search_path = public
as $$
  update team_members
  set name = new_name, avatar_url = new_avatar_url
  where member_user_id = auth.uid()
    and status = 'active';
$$;

grant execute on function sync_team_member_profile(text, text) to authenticated;
