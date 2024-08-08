const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { Pool } = require("pg");
const envConfig = JSON.parse(fs.readFileSync("../env.json", "utf8"));

const pool = new Pool({
  user: envConfig.DATABASE_USER,
  host: envConfig.DATABASE_HOST,
  database: envConfig.DATABASE_NAME,
  password: envConfig.DATABASE_PASSWORD,
  port: envConfig.DATABASE_PORT,
});

let quizzes = [];
const quizFilePath = path.join(__dirname, "quiz.json");

function clearQuizFile() {
  fs.writeFileSync(quizFilePath, JSON.stringify([], null, 2), "utf-8");
}

clearQuizFile();

router.post("/createquiz", async (req, res) => {
  const { creator, deadline, timer, quiz } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO quizzes (creator, quiz, deadline, timer) VALUES ($1, $2, $3, $4) RETURNING quizID",
      [creator, quiz, deadline, timer],
    );
    const quizID = result.rows[0].quizid;
    res.status(200).json({ quizID });
  } catch (error) {
    console.log("Error while creating quiz", error);
    res.status(500).json({ message: "Error while creating quiz" });
  }
});

router.post("/savequiz", (req, res) => {
  fs.writeFile(quizFilePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send("Error while saving quiz to file");
    } else {
      res.status(200).send("Quiz was successfully saved!");
    }
  });
});

router.get("/getquiz", (req, res) => {
  fs.readFile(quizFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error while reading quiz from file");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(JSON.parse(data));
    }
  });
});

router.get("/get-quizzes-calendar", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quizzes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error while fetching quizzes", error);
    res.status(500).json({ message: "Error while fetching quizzes" });
  }
});

router.get("/createquiz", (req, res) => {
  res.json(quizzes);
});

router.post("/submit", async (req, res) => {
  const { quizID, studentID, submission } = req.body;
  try {
    await pool.query(
      "INSERT INTO submissions (quizVersion, student, submission) VALUES ($1, $2, $3)",
      [quizID, studentID, submission],
    );
    res.status(200).json({ message: "Quiz was submitted successfully" });
  } catch (error) {
    console.log("Error while submitting quiz:", error);
    res.status(500).json({ message: "Error while submitting quiz" });
  }
});

module.exports = router;
