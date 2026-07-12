const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const exercises = [
  { name: 'Bench Press', muscleGroup: 'Prsa', equipment: 'Šipka' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Prsa', equipment: 'Bučice' },
  { name: 'Push Up', muscleGroup: 'Prsa', equipment: 'Tjelesna težina' },
  { name: 'Squat', muscleGroup: 'Noge', equipment: 'Šipka' },
  { name: 'Leg Press', muscleGroup: 'Noge', equipment: 'Sprava' },
  { name: 'Lunges', muscleGroup: 'Noge', equipment: 'Bučice' },
  { name: 'Deadlift', muscleGroup: 'Leđa', equipment: 'Šipka' },
  { name: 'Pull Up', muscleGroup: 'Leđa', equipment: 'Tjelesna težina' },
  { name: 'Barbell Row', muscleGroup: 'Leđa', equipment: 'Šipka' },
  { name: 'Lat Pulldown', muscleGroup: 'Leđa', equipment: 'Sprava' },
  { name: 'Overhead Press', muscleGroup: 'Ramena', equipment: 'Šipka' },
  { name: 'Lateral Raise', muscleGroup: 'Ramena', equipment: 'Bučice' },
  { name: 'Face Pull', muscleGroup: 'Ramena', equipment: 'Uže' },
  { name: 'Bicep Curl', muscleGroup: 'Ruke', equipment: 'Bučice' },
  { name: 'Tricep Pushdown', muscleGroup: 'Ruke', equipment: 'Uže' },
  { name: 'Hammer Curl', muscleGroup: 'Ruke', equipment: 'Bučice' },
  { name: 'Plank', muscleGroup: 'Trbušnjaci', equipment: 'Tjelesna težina' },
  { name: 'Crunch', muscleGroup: 'Trbušnjaci', equipment: 'Tjelesna težina' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Trbušnjaci', equipment: 'Šipka' },
  { name: 'Hip Thrust', muscleGroup: 'Noge', equipment: 'Šipka' },
];

async function main() {
  let created = 0;
  for (const exercise of exercises) {
    const existing = await prisma.exercise.findFirst({ where: { name: exercise.name } });
    if (!existing) {
      await prisma.exercise.create({ data: exercise });
      created += 1;
    }
  }
  console.log(`Seeded ${created} new exercises (${exercises.length - created} already existed).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
