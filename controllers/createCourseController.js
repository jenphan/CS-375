const { Pool } = require("pg");
const fs = require("fs");

// Load environment configuration
const envConfig = JSON.parse(fs.readFileSync("../env.json", "utf8"));

const pool = new Pool({
  user: envConfig.DATABASE_USER,
  host: envConfig.DATABASE_HOST,
  database: envConfig.DATABASE_NAME,
  password: envConfig.DATABASE_PASSWORD,
  port: envConfig.DATABASE_PORT,
});

const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const addCourse = async (courseName, subjectCode, courseNumber, crn) => {
  randomCode = generateRandomCode();
  console.log(randomCode);
  const query = `INSERT INTO courses (course_name, subject_code, course_number, crn, course_code) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  await pool.query(query, [
    courseName,
    subjectCode,
    courseNumber,
    crn,
    randomCode,
  ]);
};

const findCourseByName = async (courseName) => {
  const query = "SELECT * FROM courses WHERE course_name = $1";
  const result = await pool.query(query, [courseName]);
  return result.rows[0];
};

const createCourse = async (req, res) => {
  const { courseName, subjectCode, courseNumber, crn } = req.body;
  console.log(req.body);

  if (!courseName || !subjectCode || !courseNumber || !crn) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingCourse = await findCourseByName(courseName);
    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    await addCourse(courseName, subjectCode, courseNumber, crn);

    res.status(201).json({
      message: "Course created successfully",
      course: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCourse };
