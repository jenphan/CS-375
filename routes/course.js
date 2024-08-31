const express = require("express");
const {
  createCourse,
  courseList,
  studentEnroll,
  getCourseDetails,
} = require("../controllers/createCourseController");
const router = express.Router();

router.post("/create-course", createCourse);

router.post("/current-courses", courseList);

router.post("/enroll", studentEnroll);

router.post("/get-course-details", getCourseDetails);

module.exports = router;
