const prisma = require('../config/db');

exports.exerciseProgress = async (req, res) => {
  const exerciseId = Number(req.params.id);

  const sessionExercises = await prisma.sessionExercise.findMany({
    where: {
      exerciseId,
      session: { userId: req.userId },
    },
    include: { sets: true, session: true },
    orderBy: { session: { date: 'asc' } },
  });

  const points = sessionExercises.map((se) => {
    const sets = se.sets.filter((s) => s.completed);
    const maxWeight = sets.reduce((max, s) => Math.max(max, s.weight || 0), 0);
    const totalVolume = sets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
    return { date: se.session.date, maxWeight, totalVolume };
  });

  res.json({ exerciseId, points });
};

exports.muscleGroupVolume = async (req, res) => {
  const sessionExercises = await prisma.sessionExercise.findMany({
    where: { session: { userId: req.userId } },
    include: { sets: true, exercise: true },
  });

  const totals = {};
  for (const se of sessionExercises) {
    const group = se.exercise.muscleGroup;
    const volume = se.sets
      .filter((s) => s.completed)
      .reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);
    totals[group] = (totals[group] || 0) + volume;
  }

  const result = Object.entries(totals).map(([muscleGroup, volume]) => ({ muscleGroup, volume }));
  res.json({ muscleGroups: result });
};

exports.bodyweightTrend = async (req, res) => {
  const measurements = await prisma.bodyMeasurement.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'asc' },
    select: { date: true, weight: true },
  });
  res.json({ points: measurements });
};
