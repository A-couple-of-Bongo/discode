-- migrate:up
CREATE UNIQUE INDEX user_idx ON users(id);

-- migrate:down
DROP INDEX user_idx;
