-- The transactions table has SELECT/INSERT policies but no UPDATE policy, so linking a
-- sale to a customer after checkout (PaymentOptions.jsx) silently fails - the UPDATE's
-- WHERE clause matches 0 rows under RLS instead of throwing, so it looked like it worked
-- but never actually wrote anything. This adds owner/staff UPDATE access, matching the
-- same is_active_team_member() helper used for customers.
CREATE POLICY "Owners and staff can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id OR is_active_team_member(user_id))
  WITH CHECK (auth.uid() = user_id OR is_active_team_member(user_id));
