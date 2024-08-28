let {addCourse, enroll, getCourses} = require('../app/query');

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createCourse = async (req, res) => {
    const { courseName, subjectCode, courseNumber, crn} = req.body;
    console.log(req.body);
    console.log(req.session.user);

  if (!courseName || !subjectCode || !courseNumber || !crn) {
    return res.status(400).json({ message: "All fields are required" });
  }

    let courseCode = generateRandomCode()
    console.log(courseCode);
    addCourse(crn, subjectCode, courseNumber, courseName, req.session.user.userid, courseCode, req, res);
};

const courseList = async (req, res) => {
  getCourses(req.session.user.userid, req, res);
}

const studentEnroll = async(req, res) => {
  const { code } = req.body;
  console.log(code);
  console.log(req.session.user);
  if (!code){
    return res.status(400).json({ message: "Course Code not provided"});
  }

  enroll(req.session.user.userid, code, req, res);
}

module.exports = { createCourse, courseList, studentEnroll };