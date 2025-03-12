CREATE TABLE IF NOT EXISTS transactions(
    id VARCHAR(20) PRIMARY KEY,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('sale', 'restock')),
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);