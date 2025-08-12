-- migrate:up
CREATE TABLE channels (
  channel_id INT UNIQUE NOT NULL,
  server_id INT UNIQUE NOT NULL
);

-- migrate:down

DROP TABLE channels;
