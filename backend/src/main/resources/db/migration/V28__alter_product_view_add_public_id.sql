DROP MATERIALIZED VIEW view_products;

CREATE MATERIALIZED VIEW view_products
TABLESPACE pg_default
AS SELECT p.id,
    p.name,
    p.price,
    p.stock,
    p.image_url,
    p.public_id,
    c.id AS category_id,
    c.name AS category_name
   FROM products p
     LEFT JOIN categories_product cp ON p.id::text = cp.product_id::text
     LEFT JOIN categories c ON cp.category_id = c.id
  ORDER BY p.name
WITH DATA;