-- migrate:up
CREATE TABLE servers (
  server_id INT PRIMARY KEY,
  notified_channel_id INT UNIQUE,
  notified_role_id INT
);

-- migrate:down
DROP TABLE servers;
