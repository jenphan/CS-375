const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

let {pool} = require('../app/query');


const quizFilePath = path.join(__dirname, "quiz.json");
const submissionFilePath = path.join(__dirname, "submit.json");

function clearQuizFile() {
  fs.writeFileSync(quizFilePath, JSON.stringify([], null, 2), "utf-8");
}

clearQuizFile();

router.post("/createquiz", async (req, res) => {
  const { title, professorId, deadline, timer, questions } = req.body;
  console.log(req.session.user.userid);
  try {
    const result = await pool.query(
      "INSERT INTO quizzes (title, creator, quiz, deadline, timer) VALUES ($1, $2, $3, $4, $5) RETURNING quizID",
      [title, req.session.user.userid, questions, deadline, timer],
    );
    const quizID = result.rows[0].quizID;
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

router.post("/savesubmission", (req, res) => {
  fs.writeFile(submissionFilePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send("Error while saving quiz submission to file");
    } else {
      res.status(200).send("Quiz submission was successfully saved!");
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

router.get("/getquiz/:quizID", (req, res) => {
  const quizID = req.params.quizID;
  pool.query(`SELECT * FROM quizzes WHERE quizid = $1`, [quizID]).then(result =>{
    return res.status(200).json(result.rows);
  }).catch(error => {
    console.error("Error querying database", err);
    return res.status(500).json({ error: "Failed to fetch quiz data" });
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

router.post("/submit", async (req, res) => {
  const { studentid, submission, quizVersion, submissionDate } = req.body;
  try {
    await pool.query(
      "INSERT INTO submissions (student, submission, quizversion, submissiondate) VALUES ($1, $2, $3, $4)",
      [studentid, submission, quizVersion, submissionDate],
    );
    res.status(200).json({ message: "Quiz was submitted successfully" });
  } catch (error) {
    console.log("Error while submitting quiz:", error);
    res.status(500).json({ message: "Error while submitting quiz" });
  }
});

router.get("/export-quiz/:quizID", async (req, res) => {
  console.log("Exporting quiz...");
  const quizID = req.params.quizID;

  try {
    const result = await pool.query(
      "SELECT quiz FROM quizzes WHERE quizID = $1",
      [quizID],
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Quiz not found" });
    }
    const quizData = result.rows[0].quiz;
    const filePath = path.join(__dirname, `../exports/quiz_${quizID}.json`);

    fs.writeFile(filePath, JSON.stringify(quizData, null, 2), (err) => {
      if (err) {
        console.error("Error while writing quiz to file", err);
        return res.status(500).json({ error: "Failed to save quiz data" });
      } else {
        res.status(200).json({ message: "Quiz exported successfully" });
      }
    });
  } catch (err) {
    console.error("Error querying database", err);
    res.status(500).json({ error: "Failed to fetch quiz data" });
  }
});

router.get("/get-quizzes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.quizID, q.title AS quizTitle, u.username AS professorName, q.deadline
      FROM quizzes q
      JOIN users u ON q.creator = u.usrid
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error while fetching quizzes", error);
    res.status(500).json({ message: "Error while fetching quizzes" });
  }
});

router.get("/take/:quizID", async (req, res) => {
  const quizID = req.params.quizID;
  try {
    const result = await pool.query(
      `
      SELECT q.title AS quizTitle, u.username AS professorName, q.deadline, q.quiz
      FROM quizzes q
      JOIN users u ON q.creator = u.usrid
      WHERE q.quizID = $1
    `,
      [quizID],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error while fetching quizzes", error);
    res.status(500).json({ message: "Error while fetching quizzes" });
  }
});

router.get("/getSubmissions/:quizID", async (req, res) =>{
  const quizID = req.params.quizID;
  pool.query(`SELECT * FROM submissions WHERE quizVersion = $1`, [quizID]).then(result =>{
    console.log(result.rows);
    return res.status(200).json(result.rows);
  }).catch(error => {
    console.error("Error querying database", err);
    return res.status(500).json({ error: "Failed to fetch quiz data" });
  });

});

router.get("/getSubmissionByID/:submitID", async (req, res) =>{
  const submitID = req.params.submitID;
  pool.query(`SELECT * FROM submissions WHERE submitid = $1`, [submitID]).then(result =>{
    return res.status(200).json(result.rows);
  }).catch(error => {
    console.error("Error querying database", error);
    return res.status(500).json({ error: "Failed to fetch quiz data" });
  });

});

router.get("/edit/:quizID", async (req, res) => {
  const quizID = req.params.quizID;
  try {
    const result = await pool.query(
      `
      SELECT * FROM quizzes WHERE quizID = $1
      `,
      [quizID],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error while fetching quiz data" });
  }
});

router.post("/edit/:quizID", async (req, res) => {
  const quizID = req.params.quizID;
  const { title, deadline, timer, questions } = req.body;

  try {
    await pool.query(
      `
    UPDATE quizzes SET title = $1, deadline = $2, timer = $3, quiz = $4 WHERE quizID = $5
    `,
      [title, deadline, timer, questions, quizID],
    );
    res.status(200).json({ message: "Quiz updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating quiz" });
  }
});

router.get("/get-submissions/:quizID", async (req, res) => {
  const quizID = req.params.quizID;
  try {
    let result = await pool.query(
      `
      SELECT s.submitID, u.username AS studentName, s.submissionDate, s.submission, q.deadline
      FROM submissions s
      JOIN users u ON s.student = u.usrid
      JOIN quizzes q ON s.quizVersion = q.quizID
      WHERE s.quizVersion = $1
    `,
      [quizID],
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

module.exports = router;
