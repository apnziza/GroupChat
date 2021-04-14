DROP DATABASE IF EXISTS group_chat;
CREATE DATABASE group_chat;

USE group_chat;

CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  admin BOOLEAN NOT NULL DEFAULT 0,
  avatar_url VARCHAR(255),
  UNIQUE KEY(email)
);

CREATE TABLE messages(
  id INT AUTO_INCREMENT PRIMARY KEY,
  message VARCHAR(255),
  user_id INT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);