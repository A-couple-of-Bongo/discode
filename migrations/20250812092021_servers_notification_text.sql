-- migrate:up
ALTER TABLE servers
ADD notification_text TEXT;

-- migrate:down
ALTER TABLE servers
DROP COLUMN notification_text;
