-- Create the database if it doesn't exist and connect to it
-- Drop the existing database if it exists (optional)
DROP DATABASE IF EXISTS cs375;

-- Create the database
CREATE DATABASE cs375;

-- Connect to the database
\c cs375;

-- Drop the existing users table if it exists
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS courses;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    role VARCHAR(10) NOT NULL
); 

-- Insert initial data
INSERT INTO users (username, password, role) VALUES
('john_doe', 'password', 'student'), 
('jane_doe', 'wordpass', 'professor');

-- Create the courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(50) UNIQUE NOT NULL,
    subject_code VARCHAR(5) NOT NULL,
    course_number VARCHAR(3) NOT NULL,
    crn VARCHAR(5) NOT NULL,
    course_code VARCHAR(5) UNIQUE
);

-- Insert initial data
INSERT INTO courses (course_name, subject_code, course_number, crn) VALUES
('Web Development', 'CS', '375', '12345'),
('Data Structures', 'CS', '260', '23456');