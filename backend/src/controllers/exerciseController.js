const { z } = require('zod');
const prisma = require('../config/db');

const exerciseSchema = z.object({
  name: z.string().min(2),
  muscleGroup: z.string().min(2),
  equipment: z.string().optional(),
  description: z.string().optional(),
});

exports.list = async (req, res) => {
  const { muscleGroup } = req.query;

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        muscleGroup ? { muscleGroup: String(muscleGroup) } : {},
        { OR: [{ isCustom: false }, { createdByUserId: req.userId }] },
      ],
    },
    orderBy: { name: 'asc' },
  });

  res.json({ exercises });
};

exports.create = async (req, res) => {
  const data = exerciseSchema.parse(req.body);

  const exercise = await prisma.exercise.create({
    data: { ...data, isCustom: true, createdByUserId: req.userId },
  });

  res.status(201).json({ exercise });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = exerciseSchema.partial().parse(req.body);

  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing || existing.createdByUserId !== req.userId) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  const exercise = await prisma.exercise.update({ where: { id }, data });
  res.json({ exercise });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.exercise.findUnique({ where: { id } });
  if (!existing || existing.createdByUserId !== req.userId) {
    return res.status(404).json({ error: 'Exercise not found' });
  }

  await prisma.exercise.delete({ where: { id } });
  res.status(204).send();
};
