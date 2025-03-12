CREATE TABLE IF NOT EXISTS product_stock (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(20) REFERENCES products(id) ON DELETE CASCADE,
    change_type VARCHAR(10) CHECK (change_type IN ('restock', 'sale', 'adjustment')),
    quantity INT NOT NULL,
    stock_after INT NOT NULL,
    transaction_id VARCHAR(20) REFERENCES transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);