--  Drop the view that depends on the column
DROP MATERIALIZED VIEW IF EXISTS view_transaction; -- Use DROP VIEW if it's not materialized

--  Modify the column type
ALTER TABLE transactions ALTER COLUMN id TYPE VARCHAR(50);

--  Recreate the view
CREATE MATERIALIZED VIEW view_transaction AS
SELECT
    t.id AS transaction_id,
    t.created_at,
    tt.type_name AS transaction_type,
    t.product_id,
    p.name AS product_name,
    t.quantity,
    t.price_per_unit,
    (t.quantity * t.price_per_unit) AS total_price
FROM transactions t
JOIN type_transaction tt ON t.transaction_type_id = tt.id
JOIN products p ON t.product_id = p.id;