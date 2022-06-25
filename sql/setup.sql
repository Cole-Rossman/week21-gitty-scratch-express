-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users;
DROP TABLE IF EXISTS posts;

CREATE TABLE github_users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR,
    avatar VARCHAR
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description VARCHAR(255)
);

INSERT INTO posts (
    description
)
VALUES
  ('I like the sun'),
  ('This assignment was hard'),
  ('I am excited for the weekend'),
  ('Toblerones are good');