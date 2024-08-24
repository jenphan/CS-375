const express = require("express");
const router = express.Router();
const { pool } = require('../app/query');

router.get("/", async (req, res) => {
  try {
    // Ensure the user is logged in and is a student
    if (!req.session.user || req.session.user.role !== 'student') {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Retrieve the user's ID from the session
    const studentId = req.session.user.userid;

    // Query to get the grades and total score for each course, sorted by course title and submission date
    const result = await pool.query(`
        SELECT 
            c.title AS "courseTitle", 
            q.title AS "quizTitle", 
            s.grade, 
            s.submissionDate,
            s.quizVersion AS "quizID",
            s.submitID AS "submitID",
            SUM(s.grade) OVER (PARTITION BY c.title) AS "totalScore"
        FROM 
            submissions s
            JOIN quizzes q ON s.quizVersion = q.quizID
            JOIN courses c ON q.creator = c.professorid
        WHERE 
            s.student = $1
        ORDER BY c.title, s.submissionDate DESC
        `, [studentId]);
    // If no grades found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No grades found" });
    }

    // Return the grades
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving grades:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
