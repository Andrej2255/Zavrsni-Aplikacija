const db = require('../config/db');

exports.exerciseProgress = async (req, res) => {
  const exerciseId = Number(req.params.id);

  const [rows] = await db.execute(
    `SELECT se.id AS sessionExerciseId, ws.date AS date
     FROM SessionExercise se
     JOIN WorkoutSession ws ON ws.id = se.sessionId
     WHERE se.exerciseId = ? AND ws.userId = ?
     ORDER BY ws.date ASC`,
    [exerciseId, req.userId]
  );

  const points = [];
  for (const row of rows) {
    const [sets] = await db.execute(
      'SELECT * FROM SetLog WHERE sessionExerciseId = ? AND completed = 1',
      [row.sessionExerciseId]
    );
    const maxWeight = sets.reduce((max, s) => Math.max(max, s.weight || 0), 0);
    const totalVolume = sets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
    points.push({ date: row.date, maxWeight, totalVolume });
  }

  res.json({ exerciseId, points });
};

exports.muscleGroupVolume = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT sl.weight AS weight, sl.reps AS reps, e.muscleGroup AS muscleGroup
     FROM SetLog sl
     JOIN SessionExercise se ON se.id = sl.sessionExerciseId
     JOIN WorkoutSession ws ON ws.id = se.sessionId
     JOIN Exercise e ON e.id = se.exerciseId
     WHERE ws.userId = ? AND sl.completed = 1`,
    [req.userId]
  );

  const totals = {};
  for (const row of rows) {
    const volume = (row.weight || 0) * (row.reps || 0);
    totals[row.muscleGroup] = (totals[row.muscleGroup] || 0) + volume;
  }

  const muscleGroups = Object.entries(totals).map(([muscleGroup, volume]) => ({ muscleGroup, volume }));
  res.json({ muscleGroups });
};

exports.bodyweightTrend = async (req, res) => {
  const [points] = await db.execute(
    'SELECT date, weight FROM BodyMeasurement WHERE userId = ? ORDER BY date ASC',
    [req.userId]
  );
  res.json({ points });
};
