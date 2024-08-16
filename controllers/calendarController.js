const { Pool } = require("pg");
const fs = require("fs");

// Load environment configuration
const envConfig = JSON.parse(fs.readFileSync("../env.json", "utf8"));

const pool = new Pool({
  user: envConfig.DATABASE_USER,
  host: envConfig.DATABASE_HOST,
  database: "cs375",
  password: "password",
  port: envConfig.DATABASE_PORT,
});

const addAppointment = async (title, date) => {
  const query = "INSERT INTO appointments (title, date) VALUES ($1, $2)";
  await pool.query(query, [title, date]);
};

const getAppointments = async () => {
  const query = "SELECT * FROM appointments";
  const result = await pool.query(query);
  return result.rows;
};

const createAppointment = async (req, res) => {
  const { title, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await addAppointment(title, date);
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const listAppointments = async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  listAppointments,
};
