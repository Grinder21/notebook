CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  text TEXT,
  date TIMESTAMP
);