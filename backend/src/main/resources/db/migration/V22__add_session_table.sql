CREATE TABLE IF NOT EXISTS session (
    sessionid VARCHAR(50) PRIMARY KEY,
    token VARCHAR(50),
    username VARCHAR(20),
    role VARCHAR(20),
    created_time BIGINT,
    expired_time BIGINT
);