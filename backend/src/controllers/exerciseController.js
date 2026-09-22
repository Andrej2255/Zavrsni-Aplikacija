const db = require('../config/db');

exports.list = async (req, res) => {
  const { muscleGroup } = req.query;

  let sql = 'SELECT * FROM Exercise WHERE (isCustom = 0 OR createdByUserId = ?)';
  const params = [req.userId];
  if (muscleGroup) {
    sql += ' AND muscleGroup = ?';
    params.push(muscleGroup);
  }
  sql += ' ORDER BY name ASC';

  const [rows] = await db.execute(sql, params);
  const exercises = rows.map((r) => ({ ...r, isCustom: !!r.isCustom }));
  res.json({ exercises });
};

exports.create = async (req, res) => {
  const { name, muscleGroup, equipment, description } = req.body;
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (!muscleGroup || muscleGroup.length < 2) {
    return res.status(400).json({ error: 'Muscle group must be at least 2 characters' });
  }

  const [result] = await db.execute(
    'INSERT INTO Exercise (name, muscleGroup, equipment, description, isCustom, createdByUserId) VALUES (?, ?, ?, ?, 1, ?)',
    [name, muscleGroup, equipment || null, description || null, req.userId]
  );
  const [rows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [result.insertId]);
  res.status(201).json({ exercise: { ...rows[0], isCustom: !!rows[0].isCustom } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.createdByUserId !== req.userId) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  const name = req.body.name ?? existing.name;
  const muscleGroup = req.body.muscleGroup ?? existing.muscleGroup;
  const equipment = req.body.equipment ?? existing.equipment;
  const description = req.body.description ?? existing.description;

  await db.execute(
    'UPDATE Exercise SET name = ?, muscleGroup = ?, equipment = ?, description = ? WHERE id = ?',
    [name, muscleGroup, equipment, description, id]
  );
  const [updated] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [id]);
  res.json({ exercise: { ...updated[0], isCustom: !!updated[0].isCustom } });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.createdByUserId !== req.userId) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  await db.execute('DELETE FROM Exercise WHERE id = ?', [id]);
  res.status(204).send();
};
