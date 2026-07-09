-- Removes the test sale made while verifying the CRM customer-linking flow
-- (transaction a5f870a1-4d66-4673-bd2e-5c7d101b9d7c, 1x Essential 75). Stock has
-- already been restored to 184 via the app. No DELETE policy exists on these tables
-- for regular users, so this needs to run here instead.
DELETE FROM transaction_items WHERE transaction_id = 'a5f870a1-4d66-4673-bd2e-5c7d101b9d7c';
DELETE FROM transactions WHERE id = 'a5f870a1-4d66-4673-bd2e-5c7d101b9d7c';
