const db = require('../config/db');

async function attachExercise(goal) {
  if (!goal.exerciseId) {
    goal.exercise = null;
    return goal;
  }
  const [rows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [goal.exerciseId]);
  goal.exercise = rows[0] ? { ...rows[0], isCustom: !!rows[0].isCustom } : null;
  return goal;
}

exports.list = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Goal WHERE userId = ? ORDER BY createdAt DESC', [req.userId]);

  const goals = [];
  for (const row of rows) {
    row.achieved = !!row.achieved;
    goals.push(await attachExercise(row));
  }
  res.json({ goals });
};

exports.create = async (req, res) => {
  const { exerciseId, type, targetValue, targetDate, achieved } = req.body;
  if (!type || type.length < 2) {
    return res.status(400).json({ error: 'Type must be at least 2 characters' });
  }
  if (targetValue === undefined || targetValue === null || Number.isNaN(Number(targetValue))) {
    return res.status(400).json({ error: 'Target value is required' });
  }

  const [result] = await db.execute(
    'INSERT INTO Goal (userId, exerciseId, type, targetValue, targetDate, achieved) VALUES (?, ?, ?, ?, ?, ?)',
    [req.userId, exerciseId || null, type, targetValue, targetDate ? new Date(targetDate) : null, achieved ? 1 : 0]
  );
  const [rows] = await db.execute('SELECT * FROM Goal WHERE id = ?', [result.insertId]);
  const goal = rows[0];
  goal.achieved = !!goal.achieved;
  res.status(201).json({ goal: await attachExercise(goal) });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM Goal WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  const type = req.body.type ?? existing.type;
  const targetValue = req.body.targetValue ?? existing.targetValue;
  const exerciseId = req.body.exerciseId !== undefined ? req.body.exerciseId : existing.exerciseId;
  const targetDate = req.body.targetDate !== undefined
    ? (req.body.targetDate ? new Date(req.body.targetDate) : null)
    : existing.targetDate;
  const achieved = req.body.achieved !== undefined ? (req.body.achieved ? 1 : 0) : existing.achieved;

  await db.execute(
    'UPDATE Goal SET type = ?, targetValue = ?, exerciseId = ?, targetDate = ?, achieved = ? WHERE id = ?',
    [type, targetValue, exerciseId, targetDate, achieved, id]
  );
  const [updated] = await db.execute('SELECT * FROM Goal WHERE id = ?', [id]);
  const goal = updated[0];
  goal.achieved = !!goal.achieved;
  res.json({ goal: await attachExercise(goal) });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM Goal WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  await db.execute('DELETE FROM Goal WHERE id = ?', [id]);
  res.status(204).send();
};
