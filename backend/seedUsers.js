require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/models/db');

(async ()=> {
  const pw = 'password123';
  const hash = await bcrypt.hash(pw, 10);
  await db.query(`INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`, ['Manager One','manager@example.com',hash,'manager']);
  await db.query(`INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`, ['Tech One','tech@example.com',hash,'technician']);
  console.log('seeded users with password: password123');
  process.exit(0);
})();
