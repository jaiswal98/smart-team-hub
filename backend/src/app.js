require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./controllers/authController');
const taskRoutes = require('./controllers/taskController');
const path = require('path');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// basic healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
