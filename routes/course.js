const express = require("express");
const { createCourse, courseList } = require("../controllers/createCourseController");
const router = express.Router();

let {getCourses} = require("../app/query");

router.post("/create-course", createCourse);

router.post("/current-courses", courseList);

module.exports = router;
