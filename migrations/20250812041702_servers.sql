-- migrate:up
CREATE TABLE servers (
  server_id TEXT PRIMARY KEY,
  notified_channel_id TEXT UNIQUE,
  notified_role_id TEXT
);

-- migrate:down
DROP TABLE servers;
