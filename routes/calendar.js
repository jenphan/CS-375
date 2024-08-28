const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const fs = require("fs");

let { pool } = require("../app/query");

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
