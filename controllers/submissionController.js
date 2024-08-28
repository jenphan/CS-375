const { pool } = require("../app/query");

const submitQuiz = async (req, res) => {
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
}

const getSubmissionBySubmitID = async (req, res) => {
  const submitID = req.params.submitID;
  pool
    .query(`SELECT * FROM submissions WHERE submitid = $1`, [submitID])
    .then((result) => {
      return res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error querying database", error);
      return res.status(500).json({ error: "Failed to fetch quiz data" });
    });
}

const getSubmissionsByQuizID = async (req, res) => {
    const quizID = req.params.quizID;
    pool
    .query(`SELECT * FROM submissions WHERE quizVersion = $1`, [quizID])
    .then((result) => {
    return res.status(200).json(result.rows);
    })
    .catch((error) => {
    console.error("Error querying database", err);
    return res.status(500).json({ error: "Failed to fetch quiz data" });
    });
}

const getSubmissionsByUser = async (req, res) => {
    try {
      if (!req.session.user || req.session.user.role !== "student") {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const studentId = req.session.user.userid;
  
      const result = await pool.query(
        `
        SELECT s.quizVersion AS "quizID", s.student
        FROM submissions s
        WHERE s.student = $1
      `,
        [studentId],
      );
  
      return res.status(200).json(result.rows);
    } catch (error) {
      console.log("Error while retrieving submissions:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

const getAllSubmissions = async (req, res) => {
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
  }

const addGrade = async (req, res) => {
    const { submitID: id, finalScore: grade } = req.body;
    try {
      await pool.query("UPDATE submissions SET grade = $1 WHERE submitid = $2", [
        grade,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Grade was submitted successfully" });
    } catch (error) {
      console.log("Error while submitting grade:", error);
      return res.status(500).json({ message: "Error while submitting grade" });
    }
}

const addComment = async (req, res) => {
  const { submitID: id, comment: words } = req.body;
  try {
    await pool.query(
      "UPDATE submissions SET comment = $1 WHERE submitid = $2",
      [words, id],
    );
    return res
      .status(200)
      .json({ message: "Comment was submitted successfully" });
  } catch (error) {
    console.log("Error while submitting grade:", error);
    return res.status(500).json({ message: "Error while submitting grade" });
  }
}

module.exports = {
    submitQuiz,
    getSubmissionBySubmitID,
    getSubmissionsByQuizID,
    getSubmissionsByUser,
    getAllSubmissions,
    addGrade,
    addComment,
}