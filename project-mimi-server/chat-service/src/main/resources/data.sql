CREATE TABLE IF NOT EXISTS dialogs (
    id BIGSERIAL PRIMARY KEY,
    last_message_id BIGINT,
    title VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dialog_participants (
    dialog_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (dialog_id, user_id),
    FOREIGN KEY (dialog_id) REFERENCES dialogs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    dialog_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (dialog_id) REFERENCES dialogs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dialog_user_state (
    dialog_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    last_read_message_id BIGINT,
    last_read_at TIMESTAMP,
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

INSERT INTO messages (id, dialog_id, author_id, body)
SELECT 1, 1, 1, 'Günaydın!'
    WHERE NOT EXISTS (
    SELECT 1 FROM messages WHERE id = 1
);

INSERT INTO messages (id, dialog_id, author_id, body)
SELECT 2, 1, 2, 'Günaydın :7'
    WHERE NOT EXISTS (
    SELECT 1 FROM messages WHERE id = 2
);

UPDATE dialogs
SET last_message_id = 2,
    updated_at = NOW()
WHERE id = 1;

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
