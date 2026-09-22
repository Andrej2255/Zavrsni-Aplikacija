const db = require('../config/db');

async function getFullSession(id) {
  const [sessionRows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [id]);
  const session = sessionRows[0];
  if (!session) return null;

  if (session.planId) {
    const [planRows] = await db.execute('SELECT * FROM WorkoutPlan WHERE id = ?', [session.planId]);
    session.plan = planRows[0] || null;
  } else {
    session.plan = null;
  }

  const [seRows] = await db.execute(
    'SELECT * FROM SessionExercise WHERE sessionId = ? ORDER BY `order` ASC',
    [id]
  );
  const exercises = [];
  for (const se of seRows) {
    const [exRows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [se.exerciseId]);
    const [setRows] = await db.execute(
      'SELECT * FROM SetLog WHERE sessionExerciseId = ? ORDER BY setNumber ASC',
      [se.id]
    );
    const sets = setRows.map((s) => ({ ...s, completed: !!s.completed }));
    exercises.push({ ...se, exercise: { ...exRows[0], isCustom: !!exRows[0].isCustom }, sets });
  }
  session.exercises = exercises;
  return session;
}

exports.list = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM WorkoutSession WHERE userId = ? ORDER BY date DESC',
    [req.userId]
  );
  const sessions = [];
  for (const row of rows) sessions.push(await getFullSession(row.id));
  res.json({ sessions });
};

exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  const session = await getFullSession(id);
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ session });
};

exports.create = async (req, res) => {
  const { planId, date, notes } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'date is required' });
  }

  const [result] = await db.execute(
    'INSERT INTO WorkoutSession (userId, planId, date, startedAt, notes) VALUES (?, ?, ?, ?, ?)',
    [req.userId, planId || null, new Date(date), new Date(), notes ?? null]
  );
  const session = await getFullSession(result.insertId);
  res.status(201).json({ session });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const notes = req.body.notes !== undefined ? req.body.notes : existing.notes;
  const endedAt = req.body.endedAt ? new Date(req.body.endedAt) : existing.endedAt;

  await db.execute('UPDATE WorkoutSession SET notes = ?, endedAt = ? WHERE id = ?', [notes, endedAt, id]);
  const session = await getFullSession(id);
  res.json({ session });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [id]);
  const existing = rows[0];
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  await db.execute('DELETE FROM WorkoutSession WHERE id = ?', [id]);
  res.status(204).send();
};

exports.addExercise = async (req, res) => {
  const sessionId = Number(req.params.id);
  const { exerciseId, order } = req.body;
  if (!exerciseId) {
    return res.status(400).json({ error: 'exerciseId is required' });
  }

  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [sessionId]);
  const session = rows[0];
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const [result] = await db.execute(
    'INSERT INTO SessionExercise (sessionId, exerciseId, `order`) VALUES (?, ?, ?)',
    [sessionId, exerciseId, order || 0]
  );
  const [exRows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [exerciseId]);
  res.status(201).json({
    sessionExercise: {
      id: result.insertId,
      sessionId,
      exerciseId,
      order: order || 0,
      exercise: { ...exRows[0], isCustom: !!exRows[0].isCustom },
      sets: [],
    },
  });
};

exports.addSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const sessionExerciseId = Number(req.params.seId);
  const { setNumber, reps, weight, completed } = req.body;
  if (!setNumber) {
    return res.status(400).json({ error: 'setNumber is required' });
  }

  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [sessionId]);
  const session = rows[0];
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const [seRows] = await db.execute('SELECT * FROM SessionExercise WHERE id = ?', [sessionExerciseId]);
  const se = seRows[0];
  if (!se || se.sessionId !== sessionId) {
    return res.status(404).json({ error: 'Session exercise not found' });
  }

  const [result] = await db.execute(
    'INSERT INTO SetLog (sessionExerciseId, setNumber, reps, weight, completed) VALUES (?, ?, ?, ?, ?)',
    [sessionExerciseId, setNumber, reps ?? null, weight ?? null, completed ? 1 : 0]
  );
  const [setRows] = await db.execute('SELECT * FROM SetLog WHERE id = ?', [result.insertId]);
  res.status(201).json({ set: { ...setRows[0], completed: !!setRows[0].completed } });
};

exports.updateSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const setId = Number(req.params.setId);

  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [sessionId]);
  const session = rows[0];
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const [setRows] = await db.execute('SELECT * FROM SetLog WHERE id = ?', [setId]);
  const existing = setRows[0];
  if (!existing) {
    return res.status(404).json({ error: 'Set not found' });
  }

  const setNumber = req.body.setNumber ?? existing.setNumber;
  const reps = req.body.reps !== undefined ? req.body.reps : existing.reps;
  const weight = req.body.weight !== undefined ? req.body.weight : existing.weight;
  const completed = req.body.completed !== undefined ? (req.body.completed ? 1 : 0) : existing.completed;

  await db.execute(
    'UPDATE SetLog SET setNumber = ?, reps = ?, weight = ?, completed = ? WHERE id = ?',
    [setNumber, reps, weight, completed, setId]
  );
  const [updated] = await db.execute('SELECT * FROM SetLog WHERE id = ?', [setId]);
  res.json({ set: { ...updated[0], completed: !!updated[0].completed } });
};

exports.removeSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const setId = Number(req.params.setId);

  const [rows] = await db.execute('SELECT * FROM WorkoutSession WHERE id = ?', [sessionId]);
  const session = rows[0];
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  await db.execute('DELETE FROM SetLog WHERE id = ?', [setId]);
  res.status(204).send();
};
