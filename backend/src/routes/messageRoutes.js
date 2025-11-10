// src/routes/messageRoutes.js
import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/messages", verifyToken, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT sender_name, content, created_at FROM messages ORDER BY created_at DESC"
  );
  res.json(rows);
});

router.post("/messages", verifyToken, async (req, res) => {
  const { content } = req.body;
  const { name } = req.user; // or query DB for manager name
  const result = await pool.query(
    "INSERT INTO messages (sender_name, content) VALUES ($1, $2) RETURNING *",
    [name || "Manager", content]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
