\c blueboard;

DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS enrollment;
DROP TABLE IF EXISTS quizzes;


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