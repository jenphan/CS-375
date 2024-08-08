\c blueboard;

DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS enrollment CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;


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
    quizID SERIAL PRIMARY KEY,
    creator INT REFERENCES accounts(usrid),
    quiz JSON,
    deadline TIMESTAMPTZ NULL,
    timer INT
);

CREATE TABLE submissions (
    submitID SERIAL PRIMARY KEY,
    student INT REFERENCES accounts(usrid),
    submission JSON,
    quizVersion INT REFERENCES quizzes(quizID)
);