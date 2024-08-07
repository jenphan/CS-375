DROP DATABASE IF EXISTS blueboard;

-- Create the database
CREATE DATABASE blueboard;

-- Connect to the database
\c blueboard;

-- Drop the existing tables if they exist
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS enrollment;
DROP TABLE IF EXISTS quizzes;


CREATE TABLE accounts (
    accounts_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL
); 

-- Insert initial data
INSERT INTO accounts (username, password, type) VALUES
('john_doe', 'password', 'student'), 
('jane_doe', 'wordpass', 'professor');


CREATE TABLE courses (
    crn VARCHAR(10) PRIMARY KEY, 
    course_name VARCHAR(50) UNIQUE NOT NULL,
    subject_code VARCHAR(5) NOT NULL,
    course_number VARCHAR(3) NOT NULL,
    reg_code VARCHAR(5) UNIQUE,
    professorID VARCHAR(50) NOT NULL
);

INSERT INTO courses (crn, course_name, subject_code, course_number, reg_code, professorID) VALUES
('12345', 'Web Development', 'CS', '375', 'ABCDE', 'jane_doe'),
('23456', 'Data Structures', 'CS', '260', 'EDCBA', 'jane_doe');

CREATE TABLE enrollment (
    enrollment_id SERIAL PRIMARY KEY,
    usrid INT,
    courseCRN VARCHAR(10)
);

INSERT INTO enrollment (usrid, courseCRN) VALUES
(5, '12345'),
(6, '23456');