const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const [existing] = await db.execute('SELECT id FROM User WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    'INSERT INTO User (name, email, passwordHash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  const user = { id: result.insertId, name, email };
  const token = signToken(user.id);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const [rows] = await db.execute('SELECT * FROM User WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user.id);
  res.json({ token, user: toPublicUser(user) });
};

exports.me = async (req, res) => {
  const [rows] = await db.execute('SELECT id, name, email FROM User WHERE id = ?', [req.userId]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: rows[0] });
};
