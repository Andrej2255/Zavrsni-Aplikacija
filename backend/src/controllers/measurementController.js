const db = require('../config/db');

exports.list = async (req, res) => {
  const [measurements] = await db.execute(
    'SELECT * FROM BodyMeasurement WHERE userId = ? ORDER BY date ASC',
    [req.userId]
  );
  res.json({ measurements });
};

exports.create = async (req, res) => {
  const { date, weight, bodyFatPercent, notes } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  const [result] = await db.execute(
    'INSERT INTO BodyMeasurement (userId, date, weight, bodyFatPercent, notes) VALUES (?, ?, ?, ?, ?)',
    [req.userId, new Date(date), weight ?? null, bodyFatPercent ?? null, notes ?? null]
  );
  const [rows] = await db.execute('SELECT * FROM BodyMeasurement WHERE id = ?', [result.insertId]);
  res.status(201).json({ measurement: rows[0] });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM BodyMeasurement WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Measurement not found' });
  }

  await db.execute('DELETE FROM BodyMeasurement WHERE id = ?', [id]);
  res.status(204).send();
};
