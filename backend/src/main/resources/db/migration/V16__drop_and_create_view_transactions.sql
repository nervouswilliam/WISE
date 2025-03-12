DROP VIEW IF EXISTS view_transaction;

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