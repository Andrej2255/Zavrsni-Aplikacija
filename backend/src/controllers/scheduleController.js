const db = require('../config/db');

async function attachPlan(item) {
  if (!item.planId) {
    item.plan = null;
    return item;
  }
  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [item.planId]);
  item.plan = rows[0] || null;
  return item;
}

exports.list = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM ScheduledWorkout WHERE userId = ? ORDER BY scheduledDate ASC',
    [req.userId]
  );
  const scheduledWorkouts = [];
  for (const row of rows) scheduledWorkouts.push(await attachPlan(row));
  res.json({ scheduledWorkouts });
};

exports.create = async (req, res) => {
  const { planId, scheduledDate, status } = req.body;
  if (!scheduledDate) {
    return res.status(400).json({ error: 'scheduledDate is required' });
  }

  const [result] = await db.execute(
    'INSERT INTO ScheduledWorkout (userId, planId, scheduledDate, status) VALUES (?, ?, ?, ?)',
    [req.userId, planId || null, new Date(scheduledDate), status || 'planned']
  );
  const [rows] = await db.execute('SELECT * FROM ScheduledWorkout WHERE id = ?', [result.insertId]);
  res.status(201).json({ scheduledWorkout: await attachPlan(rows[0]) });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM ScheduledWorkout WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Scheduled workout not found' });
  }

  const planId = req.body.planId !== undefined ? req.body.planId : existing.planId;
  const scheduledDate = req.body.scheduledDate ? new Date(req.body.scheduledDate) : existing.scheduledDate;
  const status = req.body.status || existing.status;

  await db.execute(
    'UPDATE ScheduledWorkout SET planId = ?, scheduledDate = ?, status = ? WHERE id = ?',
    [planId, scheduledDate, status, id]
  );
  const [updated] = await db.execute('SELECT * FROM ScheduledWorkout WHERE id = ?', [id]);
  res.json({ scheduledWorkout: await attachPlan(updated[0]) });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM ScheduledWorkout WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Scheduled workout not found' });
  }

  await db.execute('DELETE FROM ScheduledWorkout WHERE id = ?', [id]);
  res.status(204).send();
};
