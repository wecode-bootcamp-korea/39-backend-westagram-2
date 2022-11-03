-- migrate:up
CREATE TABLE posts
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(2000) NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down
 DROP TABLE posts;
