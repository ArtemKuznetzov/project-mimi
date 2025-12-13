-- Ensure the 'users' table exists
CREATE TABLE IF NOT EXISTS "users" (
                                       id BIGSERIAL PRIMARY KEY,
                                       email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
    );

-- Insert the user if no existing user with the same id or email exists
INSERT INTO "users" (id, email, password, role)
SELECT 1, 'testuser@test.com',
       '$2a$10$iS3UcekRXD2c5RPvY4GbguteUidmdQ4lmWa2JjtI2Y2pxnSjcT/lS', 'ADMIN'
    WHERE NOT EXISTS (
    SELECT 1
    FROM "users"
    WHERE id = 1
       OR email = 'testuser@test.com'
);