-- Drop the existing database if it exists (optional)
DROP DATABASE IF EXISTS cs375;

-- Create the database
CREATE DATABASE cs375;

-- Connect to the database
\c cs375;

-- Drop the existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    role VARCHAR(10) NOT NULL
);

-- Insert initial data into users table
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

-- Insert initial data into courses table
INSERT INTO courses (course_name, subject_code, course_number, crn, course_code) VALUES
('Web Development', 'CS', '375', '12345', 'WD375'),
('Data Structures', 'CS', '260', '23456', 'DS260');

-- Create the enrollment table
CREATE TABLE enrollment (
    usrid INT,
    courseCRN VARCHAR(10)
);

-- Create the quizzes table
CREATE TABLE quizzes (
    quizid SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    professorid INT NOT NULL,
    deadline TIMESTAMPTZ,
    timer INT
);

-- Create the quiz_questions table
CREATE TABLE quiz_questions (
    questionid SERIAL PRIMARY KEY,
    quizid INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    points INT NOT NULL,
    autograding BOOLEAN NOT NULL,
    max_characters INT,
    min_characters INT,
    options JSONB,
    answers JSONB
);

-- Create the quiz_responses table
CREATE TABLE quiz_responses (
    responseid SERIAL PRIMARY KEY,
    quizid INT NOT NULL,
    studentid INT NOT NULL,
    responsejson JSONB NOT NULL,
    FOREIGN KEY (quizid) REFERENCES quizzes(quizid)
);

-- Create the appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL
);

-- Insert initial data into appointments table
INSERT INTO appointments (title, date) VALUES
('Meeting with John', '2024-08-05 10:00:00'),
('Project Discussion', '2024-08-06 15:00:00');

-- Insert initial data into quizzes table
INSERT INTO quizzes (title, professorid, deadline, timer) VALUES
('Web Development Quiz 1', 2, '2024-08-07 23:59:00', 60),
('Data Structures Quiz 1', 2, '2024-08-10 23:59:00', 60);

-- Insert initial data into quiz_questions table
INSERT INTO quiz_questions (quizid, type, content, points, autograding, max_characters, min_characters, options, answers) VALUES
(1, 'multiple-choice', 'What does HTML stand for?', 10, true, NULL, NULL, '["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"]', '0'),
(2, 'short-answer', 'Explain the concept of a linked list.', 20, false, NULL, NULL, NULL, '{"correctAnswer": "A linked list is a data structure consisting of a collection of nodes which together represent a sequence."}');

-- Insert initial data into quiz_responses table
INSERT INTO quiz_responses (quizid, studentid, responsejson) VALUES
(1, 1, '{"answers": [{"question": 0, "answer": 0}]}'),
(2, 1, '{"answers": [{"question": 0, "answer": "A linked list is a data structure consisting of a collection of nodes which together represent a sequence."}]}');
