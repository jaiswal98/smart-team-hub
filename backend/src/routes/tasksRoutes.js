import express from "express";
import pool from "../db.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Manager: create new task and assign to a technician
router.post(
  "/tasks",
  verifyToken,
  authorizeRoles("manager"),
  async (req, res) => {
    try {
      const { title, assigned_to } = req.body;

      if (!title || !assigned_to) {
        return res.status(400).json({ error: "Missing title or technician" });
      }

      const result = await pool.query(
        `INSERT INTO tasks (title, status, assigned_to)
         VALUES ($1, 'pending', $2)
         RETURNING *`,
        [title, assigned_to]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error creating task:", err.message);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

// ✅ Manager: view all tasks
router.get(
  "/tasks",
  verifyToken,
  authorizeRoles("manager"),
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT t.id, t.title, t.status, u.name AS technician_name, t.created_at
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         ORDER BY t.created_at DESC`
      );
      res.json(rows);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
);

// ✅ Technician: view their assigned tasks
router.get(
  "/tasks/my",
  verifyToken,
  authorizeRoles("technician"),
  async (req, res) => {
    try {
      const { id } = req.user;
      const { rows } = await pool.query(
        `SELECT id, title, status, created_at
         FROM tasks
         WHERE assigned_to = $1
         ORDER BY created_at DESC`,
        [id]
      );
      res.json(rows);
    } catch (err) {
      console.error("Error fetching my tasks:", err.message);
      res.status(500).json({ error: "Failed to fetch my tasks" });
    }
  }
);

// ✅ Technician: update task status
router.put(
  "/tasks/:id/status",
  verifyToken,
  authorizeRoles("technician"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const techId = req.user.id;

      const result = await pool.query(
        `UPDATE tasks
         SET status = $1
         WHERE id = $2 AND assigned_to = $3
         RETURNING *`,
        [status, id, techId]
      );

      if (!result.rows.length)
        return res.status(404).json({ error: "Task not found or unauthorized" });

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Error updating status:", err.message);
      res.status(500).json({ error: "Failed to update task status" });
    }
  }
);

export default router;