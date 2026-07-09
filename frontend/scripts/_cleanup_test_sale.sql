-- Removes the test sale made while verifying the notification bell fix + low-stock
-- trigger (transaction 94d1a32e-dc51-45c0-9d35-4e47198e5bbb, 1x Sony Headphone
-- WH1000XM5). Stock has already been restored to 5 via the app (RLS allows that as a
-- normal product update); these three tables have no DELETE policy for regular users,
-- so they need to be removed here instead.
DELETE FROM transaction_items WHERE transaction_id = '94d1a32e-dc51-45c0-9d35-4e47198e5bbb';
DELETE FROM transactions WHERE id = '94d1a32e-dc51-45c0-9d35-4e47198e5bbb';
DELETE FROM notifications WHERE id = 10;
