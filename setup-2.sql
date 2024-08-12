DROP DATABASE IF EXISTS cs375;
DROP DATABASE IF EXISTS blueboard;
DROP DATABASE IF EXISTS cs375blueboard;
CREATE DATABASE cs375blueboard;
\c cs375blueboard;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

CREATE TABLE users (
    usrid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(11) NOT NULL
); 

INSERT INTO users (username, password, role) VALUES
('john_doe', 'password', 'student'), 
('jane_doe', 'wordpass', 'professor');

CREATE TABLE courses (
    crn VARCHAR(10) UNIQUE PRIMARY KEY,  
    department VARCHAR(255) NOT NULL,
    number VARCHAR(3),
    title VARCHAR(255) NOT NULL, 
    professorid INT REFERENCES users(usrid), 
    registrationcode VARCHAR(10) UNIQUE
);

CREATE TABLE enrollment (
    usrid INT REFERENCES users(usrid),
    courseCRN VARCHAR(10) REFERENCES courses(crn)
);

CREATE TABLE quizzes (
    quizID SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    creator INT REFERENCES users(usrid),
    quiz JSON,
    deadline TIMESTAMPTZ,
    timer INT
);

CREATE TABLE submissions (
    submitID SERIAL PRIMARY KEY,
    student INT REFERENCES users(usrid),
    submission JSON,
    quizVersion INT REFERENCES quizzes(quizID)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL
);

-- Insert initial data
INSERT INTO users (username, password, role) VALUES
('abc', '$argon2id$v=19$m=65536,t=3,p=4$T/3Mid5O4H2tdaTdIVV35w$4n6nPs2ANYiPz77w64biA1jN7uZMpxee2EqPwQbBAVE', 'student'); -- password: password

INSERT INTO quizzes (title, creator, deadline, timer) VALUES
('Web Development Quiz 1', 1, '2024-08-07 23:59:00', 60),
('Data Structures Quiz 1', 1, '2024-08-10 23:59:00', 60);

INSERT INTO appointments (title, date) VALUES
('Meeting with John', '2024-08-05 10:00:00'),
('Project Discussion', '2024-08-06 15:00:00');
