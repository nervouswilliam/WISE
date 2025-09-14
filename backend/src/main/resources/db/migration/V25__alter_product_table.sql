DROP MATERIALIZED VIEW IF EXISTS view_products CASCADE;

DROP MATERIALIZED VIEW IF EXISTS view_transaction CASCADE;

ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(100);

ALTER TABLE products ALTER COLUMN price TYPE numeric(20,2);

CREATE MATERIALIZED VIEW view_products AS
SELECT
    p.id,
    p.name,
    p.price,
    p.stock,
    p.image_url,
    c.id AS category_id,
    c.name AS category_name
FROM products p
LEFT JOIN categories_product cp ON p.id = cp.product_id
LEFT JOIN categories c ON cp.category_id = c.id
ORDER BY p.name;

CREATE VIEW view_transaction AS
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