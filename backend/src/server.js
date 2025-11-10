import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import messageRoutes from "./routes/messageRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/usersRoutes.js";  
import taskRoutes from "./routes/tasksRoutes.js";
import "./db.js"; // ensures connection init logs

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 🔎 tiny request logger to catch 404s
app.use((req, _res, next) => {
  console.log("→", req.method, req.url);
  next();
});

// mount routes under /api
app.use("/api", messageRoutes);    // gives /api/messages
app.use("/api/auth", authRoutes);  // gives /api/auth/login
app.use("/api", userRoutes);
app.use("/api", taskRoutes);

// health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// helpful 404 to see what path was requested
app.use((req, res) => {
  console.warn("404:", req.method, req.originalUrl);
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
