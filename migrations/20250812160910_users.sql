-- migrate:up
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  leetcode_account TEXT
);

-- migrate:down
DROP TABLE users;
