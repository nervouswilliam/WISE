ALTER TABLE transactions ADD COLUMN reason TEXT;

DROP TABLE product_stock;

CREATE TABLE IF NOT EXISTS product_stock (
    product_stock_id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    transaction_id VARCHAR(50) NOT NULL REFERENCES transactions(id),
    stock_level INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);