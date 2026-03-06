-- Database schema for Contact Sync application

CREATE DATABASE IF NOT EXISTS contact_sync;
USE contact_sync;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_phone (user_id, phone),
    INDEX idx_user_id (user_id)
);