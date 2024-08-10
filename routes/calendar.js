const express = require("express");
const router = express.Router();
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

router.post("/appointments", async (req, res) => {
  try {
    const { title, date } = req.body;
    const query = "INSERT INTO appointments (title, date) VALUES ($1, $2)";
    await pool.query(query, [title, date]);
    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const query = "SELECT * FROM appointments";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
