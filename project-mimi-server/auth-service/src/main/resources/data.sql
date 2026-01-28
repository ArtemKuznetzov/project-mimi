CREATE TABLE IF NOT EXISTS "users" (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT
);

INSERT INTO "users" (id, email, password, role, display_name, avatar_url)
SELECT
    1,
    'testuser@test.com',
    '$2a$12$nH6eFuo3CfqWPUZ7iq4eZOjwAW00JC8F5GwJjGet/MBAZ8IufgvDO',
    'USER',
    'ArT:eM',
    ''
    WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE id = 1 OR email = 'testuser@test.com'
);

INSERT INTO "users" (id, email, password, role, display_name, avatar_url)
SELECT
    2,
    'beyza@test.com',
    '$2a$12$hFmZILPiPzGNjZWjLKklE.g/Dd9CcjHwTzTAK.WvjIoCCWFSLZcpq',
    'USER',
    'Beyza',
    ''
    WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE id = 2 OR email = 'beyza@test.com'
);