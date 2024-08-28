const { pool } = require("../app/query");

const createQuiz = async (req, res) => {
  const { title, course, deadline, timer, questions } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO quizzes (title, creator, course, quiz, deadline, timer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING quizID",
      [title, req.session.user.userid, course, questions, deadline, timer],
    );
    res.status(200).json({ quizID: result.rows[0].quizID });
  } catch (error) {
    console.log("Error while creating quiz", error);
    res.status(500).json({ message: "Error while creating quiz" });
  }
};

const getQuizByID = async (req, res) => {
  const quizID = req.params.quizID;
  try {
    const result = await pool.query(`SELECT * FROM quizzes WHERE quizid = $1`, [
      quizID,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error while querying database", error);
    res.status(500).json({ message: "Failed to fetch quiz data by id" });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM quizzes");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error while querying database", error);
    res.status(500).json({ message: "Failed to fetch all quiz data" });
  }
};

const getQuizzesByUser = async (req, res) => {
  const userID = req.session.user.userid;
  try {
    const result = await pool.query(
      `
            SELECT
            q.quizID,
            q.title AS quizTitle,
            u.username AS professorName,
            q.course AS courseCRN,
            c.title AS courseTitle,
            q.deadline
            FROM quizzes q
            JOIN users u ON q.creator = u.usrid
            JOIN courses c ON q.course = c.crn
            JOIN enrollment e ON e.courseCRN = c.crn
            WHERE e.usrid = $1
        `,
      [userID],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error while fetching quizzes", error);
    res.status(500).json({ message: "Error while fetching quizzes" });
  }
};

const getQuizzesByCreator = async (req, res) => {
  const creator = req.params.creator;
  pool
    .query(`SELECT * FROM quizzes WHERE creator = $1`, [creator])
    .then((result) => {
      return res.status(200).json(result.rows);
    })
    .catch((error) => {
      console.error("Error querying database", error);
      return res.status(500).json({ error: "Failed to fetch quiz data" });
    });
};

const takeQuiz = async (req, res) => {
  const quizID = req.params.quizID;
  const userID = req.session.user.userid;

  try {
    // check if user is registered for the course
    const courseCheck = await pool.query(
      `
          SELECT c.crn
          FROM courses c
          JOIN quizzes q ON q.course = c.crn
          JOIN enrollment e ON e.courseCRN = c.crn
          WHERE q.quizID = $1 AND e.usrid = $2
        `,
      [quizID, userID],
    );

    if (courseCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "You are not registered for this course" });
    }

    // check if user has already taken the quiz
    const submissionCheck = await pool.query(
      `
          SELECT submitID
          FROM submissions
          WHERE quizVersion = $1 AND student = $2
        `,
      [quizID, userID],
    );

    if (submissionCheck.rows.length > 0) {
      return res
        .status(404)
        .json({ message: "You have already taken this quiz." });
    }

    const deadlineCheck = await pool.query(
      `
          SELECT deadline
          FROM quizzes
          WHERE quizID = $1
        `,
      [quizID],
    );

    if (deadlineCheck.rows[0].deadline < new Date()) {
      return res
        .status(404)
        .json({ message: "The quiz deadline has already passed." });
    }

    const result = await pool.query(
      `
        SELECT q.title AS quizTitle, u.username AS professorName, q.deadline, q.quiz, q.timer
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
};

const updateQuiz = async (req, res) => {
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
};

module.exports = {
  createQuiz,
  getQuizByID,
  getAllQuizzes,
  getQuizzesByUser,
  getQuizzesByCreator,
  takeQuiz,
  updateQuiz,
};
