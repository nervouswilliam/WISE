CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    password VARCHAR(255),
    role VARCHAR(20)
);