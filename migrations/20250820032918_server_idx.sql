-- migrate:up
CREATE UNIQUE INDEX server_idx ON servers(server_id);

-- migrate:down
DROP INDEX server_idx;
