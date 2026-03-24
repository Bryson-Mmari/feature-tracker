CREATE DATABASE IF NOT EXISTS feature_tracker;
USE feature_tracker;

CREATE TABLE IF NOT EXISTS feature_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  status ENUM('Open', 'In Progress', 'Completed') NOT NULL DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
