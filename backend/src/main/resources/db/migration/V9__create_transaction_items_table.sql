CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(20) REFERENCES transactions(id) ON DELETE CASCADE,
    product_id VARCHAR(20) REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);