-- Kreira sve tablice za gym tracker bazu.
-- Potrebno je pokrenuti samo jednom, na praznoj bazi (nova instalacija).
-- Nazivi tablica moraju ostati u ovom obliku (velika početna slova) —
-- baš tako su nazvane i na postojećem serveru (backend/.env).

CREATE TABLE IF NOT EXISTS User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  passwordHash VARCHAR(191) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Exercise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  muscleGroup VARCHAR(191) NOT NULL,
  equipment VARCHAR(191),
  description VARCHAR(191),
  isCustom TINYINT(1) NOT NULL DEFAULT 0,
  createdByUserId INT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdByUserId) REFERENCES User(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS WorkoutPlan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(191) NOT NULL,
  description VARCHAR(191),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE IF NOT EXISTS WorkoutPlanExercise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  planId INT NOT NULL,
  exerciseId INT NOT NULL,
  `order` INT NOT NULL,
  targetSets INT,
  targetReps INT,
  targetWeight DOUBLE,
  FOREIGN KEY (planId) REFERENCES WorkoutPlan(id) ON DELETE CASCADE,
  FOREIGN KEY (exerciseId) REFERENCES Exercise(id)
);

CREATE TABLE IF NOT EXISTS ScheduledWorkout (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planId INT,
  scheduledDate DATETIME NOT NULL,
  status VARCHAR(191) NOT NULL DEFAULT 'planned',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (planId) REFERENCES WorkoutPlan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS WorkoutSession (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  planId INT,
  date DATETIME NOT NULL,
  startedAt DATETIME,
  endedAt DATETIME,
  notes VARCHAR(191),
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (planId) REFERENCES WorkoutPlan(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS SessionExercise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sessionId INT NOT NULL,
  exerciseId INT NOT NULL,
  `order` INT NOT NULL,
  FOREIGN KEY (sessionId) REFERENCES WorkoutSession(id) ON DELETE CASCADE,
  FOREIGN KEY (exerciseId) REFERENCES Exercise(id)
);

CREATE TABLE IF NOT EXISTS SetLog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sessionExerciseId INT NOT NULL,
  setNumber INT NOT NULL,
  reps INT,
  weight DOUBLE,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (sessionExerciseId) REFERENCES SessionExercise(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Goal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  exerciseId INT,
  type VARCHAR(191) NOT NULL,
  targetValue DOUBLE NOT NULL,
  targetDate DATETIME,
  achieved TINYINT(1) NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (exerciseId) REFERENCES Exercise(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS BodyMeasurement (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  date DATETIME NOT NULL,
  weight DOUBLE,
  bodyFatPercent DOUBLE,
  notes VARCHAR(191),
  FOREIGN KEY (userId) REFERENCES User(id)
);
