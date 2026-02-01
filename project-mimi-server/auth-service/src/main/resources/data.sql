CREATE TABLE IF NOT EXISTS "users" (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_id TEXT
);

INSERT INTO "users" (id, email, password, role, display_name, avatar_id)
SELECT
    1,
    'testuser@test.com',
    '$2a$12$nH6eFuo3CfqWPUZ7iq4eZOjwAW00JC8F5GwJjGet/MBAZ8IufgvDO',
    'USER',
    'ArT:eM',
    '25d4daa7-9db1-4ef8-a0d6-dc8da85ab261'
    WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE id = 1 OR email = 'testuser@test.com'
);

INSERT INTO "users" (id, email, password, role, display_name, avatar_id)
SELECT
    2,
    'beyza@test.com',
    '$2a$12$hFmZILPiPzGNjZWjLKklE.g/Dd9CcjHwTzTAK.WvjIoCCWFSLZcpq',
    'USER',
    'Beyza',
    '074800de-df2c-4680-bcae-d04e95baa40f'
    WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE id = 2 OR email = 'beyza@test.com'
);