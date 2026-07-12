const { z } = require('zod');
const prisma = require('../config/db');

const planSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

const planExerciseSchema = z.object({
  exerciseId: z.number().int(),
  order: z.number().int().default(0),
  targetSets: z.number().int().nullish(),
  targetReps: z.number().int().nullish(),
  targetWeight: z.number().nullish(),
});

async function getOwnedPlan(id, userId) {
  const plan = await prisma.workoutPlan.findUnique({ where: { id } });
  if (!plan || plan.userId !== userId) return null;
  return plan;
}

exports.list = async (req, res) => {
  const plans = await prisma.workoutPlan.findMany({
    where: { userId: req.userId },
    include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ plans });
};

exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  const plan = await prisma.workoutPlan.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true }, orderBy: { order: 'asc' } } },
  });
  if (!plan || plan.userId !== req.userId) {
    return res.status(404).json({ error: 'Plan not found' });
  }
  res.json({ plan });
};

exports.create = async (req, res) => {
  const data = planSchema.parse(req.body);
  const plan = await prisma.workoutPlan.create({
    data: { ...data, userId: req.userId },
  });
  res.status(201).json({ plan });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const data = planSchema.partial().parse(req.body);

  const owned = await getOwnedPlan(id, req.userId);
  if (!owned) return res.status(404).json({ error: 'Plan not found' });

  const plan = await prisma.workoutPlan.update({ where: { id }, data });
  res.json({ plan });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const owned = await getOwnedPlan(id, req.userId);
  if (!owned) return res.status(404).json({ error: 'Plan not found' });

  await prisma.workoutPlan.delete({ where: { id } });
  res.status(204).send();
};

exports.addExercise = async (req, res) => {
  const planId = Number(req.params.id);
  const data = planExerciseSchema.parse(req.body);

  const owned = await getOwnedPlan(planId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Plan not found' });

  const planExercise = await prisma.workoutPlanExercise.create({
    data: { planId, ...data },
    include: { exercise: true },
  });
  res.status(201).json({ planExercise });
};

exports.removeExercise = async (req, res) => {
  const planId = Number(req.params.id);
  const peId = Number(req.params.peId);

  const owned = await getOwnedPlan(planId, req.userId);
  if (!owned) return res.status(404).json({ error: 'Plan not found' });

  await prisma.workoutPlanExercise.deleteMany({ where: { id: peId, planId } });
  res.status(204).send();
};
