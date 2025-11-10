// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // PostgreSQL pool connection
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = "supersecretkey"; // move to .env in production

// Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash || user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
console.log("JWT_SECRET used for SIGN:", process.env.JWT_SECRET);

export default router;
