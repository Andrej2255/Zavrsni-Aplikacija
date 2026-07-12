const { z } = require('zod');
const prisma = require('../config/db');

const goalSchema = z.object({
  exerciseId: z.number().int().nullish(),
  type: z.string().min(2),
  targetValue: z.number(),
  targetDate: z.string().nullish(),
  achieved: z.boolean().optional(),
});

exports.list = async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { userId: req.userId },
    include: { exercise: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ goals });
};

exports.create = async (req, res) => {
  const data = goalSchema.parse(req.body);
  const goal = await prisma.goal.create({
    data: {
      userId: req.userId,
      exerciseId: data.exerciseId,
      type: data.type,
      targetValue: data.targetValue,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      achieved: data.achieved || false,
    },
  });
  res.status(201).json({ goal });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = goalSchema.partial().parse(req.body);

  const existing = await prisma.goal.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...data,
      ...(data.targetDate && { targetDate: new Date(data.targetDate) }),
    },
  });
  res.json({ goal });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.goal.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Goal not found' });
  }

  await prisma.goal.delete({ where: { id } });
  res.status(204).send();
};
