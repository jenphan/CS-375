const express = require("express");
const {
  createCourse,
  courseList,
  studentEnroll,
} = require("../controllers/createCourseController");
const router = express.Router();

router.post("/create-course", createCourse);

router.post("/current-courses", courseList);

router.post("/enroll", studentEnroll);

module.exports = router;
