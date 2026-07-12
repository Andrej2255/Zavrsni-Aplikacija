const { z } = require('zod');
const prisma = require('../config/db');

const sessionSchema = z.object({
  planId: z.number().int().nullish(),
  date: z.string().min(1),
  notes: z.string().nullish(),
});

const sessionUpdateSchema = z.object({
  notes: z.string().optional(),
  endedAt: z.string().optional(),
});

const sessionExerciseSchema = z.object({
  exerciseId: z.number().int(),
  order: z.number().int().default(0),
});

const setLogSchema = z.object({
  setNumber: z.number().int(),
  reps: z.number().int().nullish(),
  weight: z.number().nullish(),
  completed: z.boolean().optional(),
});

const fullInclude = {
  exercises: {
    include: { exercise: true, sets: true },
    orderBy: { order: 'asc' },
  },
  plan: true,
};

async function getOwnedSession(id, userId) {
  const session = await prisma.workoutSession.findUnique({ where: { id } });
  if (!session || session.userId !== userId) return null;
  return session;
}

exports.list = async (req, res) => {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId: req.userId },
    include: fullInclude,
    orderBy: { date: 'desc' },
  });
  res.json({ sessions });
};

exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  const session = await prisma.workoutSession.findUnique({ where: { id }, include: fullInclude });
  if (!session || session.userId !== req.userId) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ session });
};

exports.create = async (req, res) => {
  const data = sessionSchema.parse(req.body);
  const session = await prisma.workoutSession.create({
    data: {
      userId: req.userId,
      planId: data.planId,
      date: new Date(data.date),
      startedAt: new Date(),
      notes: data.notes,
    },
    include: fullInclude,
  });
  res.status(201).json({ session });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = sessionUpdateSchema.parse(req.body);

  const owned = await getOwnedSession(id, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  const session = await prisma.workoutSession.update({
    where: { id },
    data: {
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.endedAt && { endedAt: new Date(data.endedAt) }),
    },
    include: fullInclude,
  });
  res.json({ session });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const owned = await getOwnedSession(id, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  await prisma.workoutSession.delete({ where: { id } });
  res.status(204).send();
};

exports.addExercise = async (req, res) => {
  const sessionId = Number(req.params.id);
  const data = sessionExerciseSchema.parse(req.body);

  const owned = await getOwnedSession(sessionId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  const sessionExercise = await prisma.sessionExercise.create({
    data: { sessionId, ...data },
    include: { exercise: true, sets: true },
  });
  res.status(201).json({ sessionExercise });
};

exports.addSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const sessionExerciseId = Number(req.params.seId);
  const data = setLogSchema.parse(req.body);

  const owned = await getOwnedSession(sessionId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  const se = await prisma.sessionExercise.findUnique({ where: { id: sessionExerciseId } });
  if (!se || se.sessionId !== sessionId) {
    return res.status(404).json({ error: 'Session exercise not found' });
  }

  const set = await prisma.setLog.create({
    data: { sessionExerciseId, ...data },
  });
  res.status(201).json({ set });
};

exports.updateSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const setId = Number(req.params.setId);
  const data = setLogSchema.partial().parse(req.body);

  const owned = await getOwnedSession(sessionId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  const set = await prisma.setLog.update({ where: { id: setId }, data });
  res.json({ set });
};

exports.removeSet = async (req, res) => {
  const sessionId = Number(req.params.id);
  const setId = Number(req.params.setId);

  const owned = await getOwnedSession(sessionId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Session not found' });

  await prisma.setLog.delete({ where: { id: setId } });
  res.status(204).send();
};
