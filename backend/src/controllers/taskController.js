const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyJWT } = require('../utils/jwt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// place uploads in src/uploads (make sure folder exists)
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    cb(null, `${unique}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.use(verifyJWT);

// Create a task (manager)
router.post('/', async (req, res) => {
  try {
    const { title, description, assigned_to } = req.body;
    const result = await db.query(
      `INSERT INTO tasks(title, description, assigned_to, status, created_at) 
       VALUES($1,$2,$3,$4,NOW()) RETURNING *`,
      [title, description, assigned_to || null, 'assigned']
    );
    const task = result.rows[0];

    // emit to assignee via socket
    const io = req.app.get('io');
    if (io && assigned_to) io.to(`user:${assigned_to}`).emit('task:assigned', task);

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM tasks WHERE assigned_to=$1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload photo for a task
router.post('/:taskId/photo', upload.single('photo'), async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const result = await db.query(
      `INSERT INTO task_photos(task_id, url, uploaded_by, created_at) VALUES($1,$2,$3,NOW()) RETURNING *`,
      [taskId, url, req.user.id]
    );

    // Emit to watchers
    const io = req.app.get('io');
    io?.to(`task:${taskId}`).emit('task:photoUploaded', { taskId: Number(taskId), photo: result.rows[0] });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark task completed (technician)
router.post('/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;
    await db.query('UPDATE tasks SET status=$1, updated_at=NOW() WHERE id=$2', ['completed', taskId]);
    const updated = await db.query('SELECT * FROM tasks WHERE id=$1', [taskId]);
    const task = updated.rows[0];

    const io = req.app.get('io');
    io?.to(`user:${task.assigned_to}`).emit('task:statusUpdated', { taskId: Number(taskId), status: 'completed' });
    io?.to(`task:${taskId}`).emit('task:statusUpdated', { taskId: Number(taskId), status: 'completed' });

    res.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join a task room (for live annotations / watchers)
router.post('/:taskId/join', async (req, res) => {
  // This endpoint is just a convenience; actual join is done over socket 'joinTask'
  res.json({ ok: true });
});

module.exports = router;
