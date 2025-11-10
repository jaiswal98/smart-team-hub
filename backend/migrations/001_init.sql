CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  assigned_to INTEGER REFERENCES users(id),
  status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_photos (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id),
  url TEXT,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id),
  user_id INTEGER REFERENCES users(id),
  action TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(100),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

/* Seed a demo manager and technician (passwords are bcrypt hashes for 'password123') */
-- Replace hashes if you want to create them in code; for quick dev we will create users with bcrypt later via a small script or manually.
