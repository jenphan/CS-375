const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

router.post("/submit", submissionController.submitQuiz);
router.post("/add-grade", submissionController.addGrade);
router.post("/add-comment", submissionController.addComment);

router.get("/get-all-by-submitid/:submitID", submissionController.getSubmissionBySubmitID);
router.get("/get-all-by-quizid/:quizID", submissionController.getSubmissionsByQuizID);
router.get("/get-all-by-user", submissionController.getSubmissionsByUser);
router.get("/list-all/:quizID", submissionController.getAllSubmissions);

module.exports = router;