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