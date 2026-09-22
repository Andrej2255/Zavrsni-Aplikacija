const db = require('../config/db');

async function getPlanWithExercises(id) {
  const [planRows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [id]);
  const plan = planRows[0];
  if (!plan) return null;

  const [peRows] = await db.execute(
    'SELECT * FROM WorkoutPlanExercise WHERE planId = ? ORDER BY `order` ASC',
    [id]
  );
  const exercises = [];
  for (const pe of peRows) {
    const [exRows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [pe.exerciseId]);
    exercises.push({ ...pe, exercise: { ...exRows[0], isCustom: !!exRows[0].isCustom } });
  }
  plan.exercises = exercises;
  return plan;
}

exports.list = async (req, res) => {
  const [plans] = await db.execute(
    'SELECT * FROM WorkoutPlan WHERE userId = ? ORDER BY createdAt DESC',
    [req.userId]
  );
  for (const plan of plans) {
    const full = await getPlanWithExercises(plan.id);
    plan.exercises = full.exercises;
  }
  res.json({ plans });
};

exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  const plan = await getPlanWithExercises(id);
  if (!plan || plan.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json({ plan });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  const [result] = await db.execute(
    'INSERT INTO WorkoutPlan (userId, name, description) VALUES (?, ?, ?)',
    [req.userId, name, description || null]
  );
  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [result.insertId]);
  res.status(201).json({ plan: rows[0] });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const name = req.body.name ?? existing.name;
  const description = req.body.description ?? existing.description;

  await db.execute('UPDATE WorkoutPlan SET name = ?, description = ? WHERE id = ?', [name, description, id]);
  const [updated] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [id]);
  res.json({ plan: updated[0] });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  await db.execute('DELETE FROM WorkoutPlan WHERE id = ?', [id]);
  res.status(204).send();
};

exports.addExercise = async (req, res) => {
  const planId = Number(req.params.id);
  const { exerciseId, order, targetSets, targetReps, targetWeight } = req.body;
  if (!exerciseId) {
    return res.status(400).json({ error: 'exerciseId is required' });
  }

  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [planId]);
  const plan = rows[0];
  if (!plan || plan.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  const [result] = await db.execute(
    'INSERT INTO WorkoutPlanExercise (planId, exerciseId, `order`, targetSets, targetReps, targetWeight) VALUES (?, ?, ?, ?, ?, ?)',
    [planId, exerciseId, order || 0, targetSets ?? null, targetReps ?? null, targetWeight ?? null]
  );
  const [peRows] = await db.execute('SELECT * FROM WorkoutPlanExercise WHERE id = ?', [result.insertId]);
  const [exRows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [exerciseId]);
  res.status(201).json({ planExercise: { ...peRows[0], exercise: { ...exRows[0], isCustom: !!exRows[0].isCustom } } });
};

exports.removeExercise = async (req, res) => {
  const planId = Number(req.params.id);
  const peId = Number(req.params.peId);

  const [rows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [planId]);
  const plan = rows[0];
  if (!plan || plan.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  await db.execute('DELETE FROM WorkoutPlanExercise WHERE id = ? AND planId = ?', [peId, planId]);
  res.status(204).send();
};
