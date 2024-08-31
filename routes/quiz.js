const express = require("express");
const router = express.Router();
const { pool } = require("../app/query");
const quizController = require("../controllers/quizController");

router.post("/create", quizController.createQuiz);
router.get("/get/:quizID", quizController.getQuizByID);

router.get("/get-all", quizController.getAllQuizzes);
router.get("/get-all-by-user", quizController.getQuizzesByUser);
router.get("/get-all-by-creator/:creator", quizController.getQuizzesByCreator);

router.get("/take/:quizID", quizController.takeQuiz);

router
  .route("/edit/:quizID")
  .get(quizController.getQuizByID)
  .post(quizController.updateQuiz);

router.get("/getUserByID/:userID", (req, res) => {
  const userID = req.params.userID;
  pool
    .query(`SELECT * FROM users WHERE usrid = $1`, [userID])
    .then((result) => {
      return res.status(200).json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error querying database", error);
      return res.status(500).json({ error: "Failed to fetch quiz data" });
    });
});

router.get("/get-all-by-course/:courseID", async (req, res) => {
  const courseID = req.params.courseID;
  pool
    .query(`SELECT * FROM quizzes WHERE course = $1`, [courseID])
    .then((result) => {
      return res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error querying database", error);
      return res.status(500).json({ error: "Failed to fetch quiz data" });
    });
})

module.exports = router;
