CREATE TABLE IF NOT EXISTS dialogs (
    id BIGSERIAL PRIMARY KEY,
    last_message_id BIGINT,
    title VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dialog_participants (
    dialog_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (dialog_id, user_id),
    FOREIGN KEY (dialog_id) REFERENCES dialogs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    dialog_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (dialog_id) REFERENCES dialogs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dialog_user_state (
    dialog_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    last_read_message_id BIGINT,
    last_read_at TIMESTAMPTZ,
    PRIMARY KEY (dialog_id, user_id),
    FOREIGN KEY (dialog_id) REFERENCES dialogs(id) ON DELETE CASCADE,
    FOREIGN KEY (last_read_message_id) REFERENCES messages(id)
);

INSERT INTO dialogs (id)
SELECT 1
    WHERE NOT EXISTS (
    SELECT 1 FROM dialogs WHERE id = 1
);

INSERT INTO dialog_participants (dialog_id, user_id)
SELECT 1, 1
    WHERE NOT EXISTS (
    SELECT 1 FROM dialog_participants
    WHERE dialog_id = 1 AND user_id = 1
);

INSERT INTO dialog_participants (dialog_id, user_id)
SELECT 1, 2
    WHERE NOT EXISTS (
    SELECT 1 FROM dialog_participants
    WHERE dialog_id = 1 AND user_id = 2
);

INSERT INTO messages (id, dialog_id, author_id, body, created_at)
SELECT 1, 1, 1, 'Günaydın!', NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM messages WHERE id = 1
);

INSERT INTO messages (id, dialog_id, author_id, body, created_at)
SELECT 2, 1, 2, 'Günaydın :7', NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM messages WHERE id = 2
);

UPDATE dialogs
SET last_message_id = 2,
    updated_at = NOW()
WHERE id = 1;

SELECT setval(pg_get_serial_sequence('dialogs', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM dialogs),
              true);
SELECT setval(pg_get_serial_sequence('messages', 'id'),
              (SELECT COALESCE(MAX(id), 1) FROM messages),
              true);

-- ArT:eM read everything
INSERT INTO dialog_user_state (dialog_id, user_id, last_read_message_id, last_read_at)
SELECT 1, 1, 2, NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM dialog_user_state
    WHERE dialog_id = 1 AND user_id = 1
);

-- Beyza read only the first message
INSERT INTO dialog_user_state (dialog_id, user_id, last_read_message_id, last_read_at)
SELECT 1, 2, 1, NOW()
    WHERE NOT EXISTS (
    SELECT 1 FROM dialog_user_state
    WHERE dialog_id = 1 AND user_id = 2
);
