DROP VIEW view_product_stock;

CREATE MATERIALIZED VIEW view_product_stock AS
SELECT
    t.id AS transaction_id,
    t.product_id,
    p.stock AS stock_level,
    t.quantity,
    t.price_per_unit,
    t.created_at
FROM transactions t
JOIN products p ON t.product_id = p.id;