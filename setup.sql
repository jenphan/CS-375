-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);

-- Insert initial data
INSERT INTO users (username, email, password, role) VALUES
('john_doe', 'jd567@gmail.com','password', 'student'), 
('jane_doe', 'jd123@drexel.edu','wordpass', 'professor');



-- Open psql cmd: psql -U your_username
-- Create the database: CREATE DATABASE CS375;
-- Connect to the database: \c CS375
-- Run the setup.sql script: \i /path/to/setup.sql
