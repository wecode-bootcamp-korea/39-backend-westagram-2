-- migrate:up
ALTER TABLE posts ADD image_url VARCHAR(50) NULL;

-- migrate:down

