\c blueboard;

DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS quiz_options CASCADE;


CREATE TABLE accounts (
    usrid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL
); 

CREATE TABLE classes (
    crn VARCHAR(10) PRIMARY KEY, 
    department VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL, 
    professorid INT, 
    registrationcode VARCHAR(10) UNIQUE
);

CREATE TABLE enrollment (
    usrid INT,
    courseCRN VARCHAR(10)
);

CREATE TABLE quizzes (
    quizid SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    professorid INT NOT NULL,
    deadline TIMESTAMPTZ,
    timer INT
);

CREATE TABLE quiz_questions (
    questionid SERIAL PRIMARY KEY,
    quizid INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    points INT NOT NULL,
    autograding BOOLEAN NOT NULL,
    max_characters INT,
    min_characters INT
);

CREATE TABLE quiz_responses (
    responseid SERIAL PRIMARY KEY,
    quizid INT NOT NULL,
    studentid INT NOT NULL,
    responsejson JSONB NOT NULL,
    FOREIGN KEY (quizid) REFERENCES quizzes(quizid)
);