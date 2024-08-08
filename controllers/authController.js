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

const createUser = async (username, password, role) => {
  const query =
    "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)";
  await pool.query(query, [username, password, role]);
};

const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  console.log(req.body);

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await createUser(username, password, role);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Set session data
    req.session.user = { username: user.username, role: user.role };

    res
      .status(200)
      .json({
        message: "Login successful",
        user: { username: user.username, role: user.role },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
