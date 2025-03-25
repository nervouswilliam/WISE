-- 1️⃣ Drop the existing transactions table (only if it exists)
DROP TABLE IF EXISTS transactions CASCADE;

-- 3️⃣ Ensure type_transaction table exists before inserting
CREATE TABLE IF NOT EXISTS type_transaction (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(20) UNIQUE NOT NULL
);

-- 2️⃣ Recreate transactions table with the correct structure
CREATE TABLE transactions (
    id VARCHAR(20) PRIMARY KEY,
    transaction_type_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_type_id) REFERENCES type_transaction(id) ON DELETE RESTRICT
);

-- 4️⃣ Insert predefined transaction types (if they don’t already exist)
INSERT INTO type_transaction (type_name)
VALUES ('sale'), ('restock')
ON CONFLICT (type_name) DO NOTHING;