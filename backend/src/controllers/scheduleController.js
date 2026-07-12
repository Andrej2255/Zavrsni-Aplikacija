const { z } = require('zod');
const prisma = require('../config/db');

const scheduleSchema = z.object({
  planId: z.number().int().nullish(),
  scheduledDate: z.string().datetime().or(z.string().min(1)),
  status: z.enum(['planned', 'completed', 'skipped']).optional(),
});

exports.list = async (req, res) => {
  const items = await prisma.scheduledWorkout.findMany({
    where: { userId: req.userId },
    include: { plan: true },
    orderBy: { scheduledDate: 'asc' },
  });
  res.json({ scheduledWorkouts: items });
};

exports.create = async (req, res) => {
  const data = scheduleSchema.parse(req.body);
  const item = await prisma.scheduledWorkout.create({
    data: {
      userId: req.userId,
      planId: data.planId,
      scheduledDate: new Date(data.scheduledDate),
      status: data.status || 'planned',
    },
    include: { plan: true },
  });
  res.status(201).json({ scheduledWorkout: item });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = scheduleSchema.partial().parse(req.body);

  const existing = await prisma.scheduledWorkout.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Scheduled workout not found' });
  }

  const item = await prisma.scheduledWorkout.update({
    where: { id },
    data: {
      ...(data.planId !== undefined && { planId: data.planId }),
      ...(data.scheduledDate && { scheduledDate: new Date(data.scheduledDate) }),
      ...(data.status && { status: data.status }),
    },
    include: { plan: true },
  });
  res.json({ scheduledWorkout: item });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.scheduledWorkout.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Scheduled workout not found' });
  }

  await prisma.scheduledWorkout.delete({ where: { id } });
  res.status(204).send();
};
