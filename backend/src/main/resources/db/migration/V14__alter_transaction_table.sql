-- 1️⃣ Add new column product_id with foreign key reference
ALTER TABLE transactions ADD COLUMN product_id VARCHAR(20);
ALTER TABLE transactions ADD CONSTRAINT fk_transaction_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT;

-- 2️⃣ Add new column price_per_item
ALTER TABLE transactions ADD COLUMN price_per_unit DECIMAL(10,2) NOT NULL;

-- 3️⃣ Drop total_price column
ALTER TABLE transactions DROP COLUMN total_price;

ALTER TABLE transactions ADD COLUMN quantity INT