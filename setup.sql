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


CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(50) NOT NULL,
    subject_code VARCHAR(5) NOT NULL,
    course_number INT(3) NOT NULL,
    crn INT(5) NOT NULL
);

INSERT INTO courses (course_name, subject_code, course_number, crn) VALUES
('Web Development', 'CS', 375, 12345),
('Data Structures', 'CS', 260, 54321);

-- Open psql cmd: psql -U your_username
-- Create the database: CREATE DATABASE CS375;
-- Connect to the database: \c CS375
-- Run the setup.sql script: \i /path/to/setup.sql
