const { z } = require('zod');
const prisma = require('../config/db');

const measurementSchema = z.object({
  date: z.string().min(1),
  weight: z.number().nullish(),
  bodyFatPercent: z.number().nullish(),
  notes: z.string().nullish(),
});

exports.list = async (req, res) => {
  const measurements = await prisma.bodyMeasurement.findMany({
    where: { userId: req.userId },
    orderBy: { date: 'asc' },
  });
  res.json({ measurements });
};

exports.create = async (req, res) => {
  const data = measurementSchema.parse(req.body);
  const measurement = await prisma.bodyMeasurement.create({
    data: { ...data, date: new Date(data.date), userId: req.userId },
  });
  res.status(201).json({ measurement });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.bodyMeasurement.findUnique({ where: { id } });
  if (!existing || existing.userId !== req.userId) {
    return res.status(404).json({ error: 'Measurement not found' });
  }

  await prisma.bodyMeasurement.delete({ where: { id } });
  res.status(204).send();
};
