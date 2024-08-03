-- Create the database if it doesn't exist and connect to it
-- Drop the existing database if it exists (optional)
DROP DATABASE IF EXISTS cs375;

-- Create the database
CREATE DATABASE cs375;

-- Connect to the database
\c cs375;

-- Drop the existing users table if it exists
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);

-- Insert initial data
INSERT INTO users (username, password, role) VALUES
('john_doe', 'password', 'student'), 
('jane_doe', 'wordpass', 'professor');