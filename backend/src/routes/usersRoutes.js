import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Fetch all users (for Manager dashboard)
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/users error:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
