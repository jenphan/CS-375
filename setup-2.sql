DROP DATABASE IF EXISTS blueboard;
CREATE DATABASE blueboard;
\c blueboard;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;


CREATE TABLE users (
    usrid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(11) NOT NULL
); 

CREATE TABLE courses (
    crn VARCHAR(10) UNIQUE PRIMARY KEY, 
    department VARCHAR(255) NOT NULL,
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
