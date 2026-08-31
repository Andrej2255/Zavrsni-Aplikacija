-- MySQL dump 10.13  Distrib 8.4.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gym_tracker
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `gym_tracker`
--

/*!40000 DROP DATABASE IF EXISTS `gym_tracker`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `gym_tracker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `gym_tracker`;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('944d00ef-df81-4b4e-a148-edb7254646a7','bd3618768330f1d1aad07ccb1cc28fe12d4777a1eee4c9dc4c507160ee09b2f6','2026-07-12 16:35:17.540','20260712142211_init',NULL,NULL,'2026-07-12 16:35:16.658',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bodymeasurement`
--

DROP TABLE IF EXISTS `bodymeasurement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bodymeasurement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `weight` double DEFAULT NULL,
  `bodyFatPercent` double DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `BodyMeasurement_userId_fkey` (`userId`),
  CONSTRAINT `BodyMeasurement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bodymeasurement`
--

LOCK TABLES `bodymeasurement` WRITE;
/*!40000 ALTER TABLE `bodymeasurement` DISABLE KEYS */;
INSERT INTO `bodymeasurement` VALUES (1,6,'2026-08-02 00:00:00.000',82.4,NULL,NULL),(2,6,'2026-08-09 00:00:00.000',82,NULL,NULL),(3,6,'2026-08-16 00:00:00.000',81.3,NULL,NULL),(4,6,'2026-08-23 00:00:00.000',80.8,NULL,NULL),(5,6,'2026-08-29 00:00:00.000',80.2,NULL,NULL);
/*!40000 ALTER TABLE `bodymeasurement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `muscleGroup` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isCustom` tinyint(1) NOT NULL DEFAULT '0',
  `createdByUserId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Exercise_createdByUserId_fkey` (`createdByUserId`),
  CONSTRAINT `Exercise_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'Bench Press','Prsa','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.684'),(2,'Incline Dumbbell Press','Prsa','Bučice',NULL,0,NULL,'2026-07-12 16:35:25.690'),(3,'Push Up','Prsa','Tjelesna težina',NULL,0,NULL,'2026-07-12 16:35:25.693'),(4,'Squat','Noge','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.696'),(5,'Leg Press','Noge','Sprava',NULL,0,NULL,'2026-07-12 16:35:25.699'),(6,'Lunges','Noge','Bučice',NULL,0,NULL,'2026-07-12 16:35:25.702'),(7,'Deadlift','Leđa','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.706'),(8,'Pull Up','Leđa','Tjelesna težina',NULL,0,NULL,'2026-07-12 16:35:25.709'),(9,'Barbell Row','Leđa','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.712'),(10,'Lat Pulldown','Leđa','Sprava',NULL,0,NULL,'2026-07-12 16:35:25.715'),(11,'Overhead Press','Ramena','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.718'),(12,'Lateral Raise','Ramena','Bučice',NULL,0,NULL,'2026-07-12 16:35:25.721'),(13,'Face Pull','Ramena','Uže',NULL,0,NULL,'2026-07-12 16:35:25.724'),(14,'Bicep Curl','Ruke','Bučice',NULL,0,NULL,'2026-07-12 16:35:25.727'),(15,'Tricep Pushdown','Ruke','Uže',NULL,0,NULL,'2026-07-12 16:35:25.729'),(16,'Hammer Curl','Ruke','Bučice',NULL,0,NULL,'2026-07-12 16:35:25.732'),(17,'Plank','Trbušnjaci','Tjelesna težina',NULL,0,NULL,'2026-07-12 16:35:25.735'),(18,'Crunch','Trbušnjaci','Tjelesna težina',NULL,0,NULL,'2026-07-12 16:35:25.738'),(19,'Hanging Leg Raise','Trbušnjaci','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.741'),(20,'Hip Thrust','Noge','Šipka',NULL,0,NULL,'2026-07-12 16:35:25.744');
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `exerciseId` int DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetValue` double NOT NULL,
  `targetDate` datetime(3) DEFAULT NULL,
  `achieved` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Goal_userId_fkey` (`userId`),
  KEY `Goal_exerciseId_fkey` (`exerciseId`),
  CONSTRAINT `Goal_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `exercise` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Goal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
INSERT INTO `goal` VALUES (1,6,1,'Bench press 80 kg',80,'2026-10-29 00:00:00.000',0,'2026-08-30 22:14:41.010'),(2,6,7,'Deadlift 140 kg',140,'2026-11-28 00:00:00.000',0,'2026-08-30 22:14:41.023'),(3,6,NULL,'12 treninga u mjesecu',12,NULL,1,'2026-08-30 22:14:41.028');
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheduledworkout`
--

DROP TABLE IF EXISTS `scheduledworkout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheduledworkout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `planId` int DEFAULT NULL,
  `scheduledDate` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planned',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ScheduledWorkout_userId_fkey` (`userId`),
  KEY `ScheduledWorkout_planId_fkey` (`planId`),
  CONSTRAINT `ScheduledWorkout_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `workoutplan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ScheduledWorkout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheduledworkout`
--

LOCK TABLES `scheduledworkout` WRITE;
/*!40000 ALTER TABLE `scheduledworkout` DISABLE KEYS */;
INSERT INTO `scheduledworkout` VALUES (1,6,3,'2026-08-31 00:00:00.000','planned','2026-08-30 22:14:40.987'),(2,6,2,'2026-09-02 00:00:00.000','planned','2026-08-30 22:14:40.994'),(3,6,3,'2026-09-04 00:00:00.000','planned','2026-08-30 22:14:41.004');
/*!40000 ALTER TABLE `scheduledworkout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionexercise`
--

DROP TABLE IF EXISTS `sessionexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessionexercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionId` int NOT NULL,
  `exerciseId` int NOT NULL,
  `order` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SessionExercise_sessionId_fkey` (`sessionId`),
  KEY `SessionExercise_exerciseId_fkey` (`exerciseId`),
  CONSTRAINT `SessionExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `exercise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SessionExercise_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `workoutsession` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionexercise`
--

LOCK TABLES `sessionexercise` WRITE;
/*!40000 ALTER TABLE `sessionexercise` DISABLE KEYS */;
INSERT INTO `sessionexercise` VALUES (1,1,1,0),(2,1,11,1),(3,1,2,2),(4,1,15,3),(5,2,1,0),(6,2,11,1),(7,2,2,2),(8,2,15,3),(9,3,1,0),(10,3,11,1),(11,3,2,2),(12,3,15,3),(13,4,1,0),(14,4,11,1),(15,4,2,2),(16,4,15,3);
/*!40000 ALTER TABLE `sessionexercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setlog`
--

DROP TABLE IF EXISTS `setlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionExerciseId` int NOT NULL,
  `setNumber` int NOT NULL,
  `reps` int DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `SetLog_sessionExerciseId_fkey` (`sessionExerciseId`),
  CONSTRAINT `SetLog_sessionExerciseId_fkey` FOREIGN KEY (`sessionExerciseId`) REFERENCES `sessionexercise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setlog`
--

LOCK TABLES `setlog` WRITE;
/*!40000 ALTER TABLE `setlog` DISABLE KEYS */;
INSERT INTO `setlog` VALUES (1,1,1,8,55,1),(2,1,2,8,52.5,1),(3,1,3,7,50,1),(4,1,4,6,47.5,1),(5,2,1,10,30,1),(6,2,2,9,27.5,1),(7,2,3,8,25,1),(8,3,1,12,18,1),(9,3,2,11,15.5,1),(10,3,3,10,13,1),(11,4,1,15,25,1),(12,4,2,15,22.5,1),(13,4,3,14,20,1),(14,5,1,8,57.5,1),(15,5,2,8,55,1),(16,5,3,7,52.5,1),(17,5,4,6,50,1),(18,6,1,10,32.5,1),(19,6,2,9,30,1),(20,6,3,8,27.5,1),(21,7,1,12,20,1),(22,7,2,11,17.5,1),(23,7,3,10,15,1),(24,8,1,15,25,1),(25,8,2,15,22.5,1),(26,8,3,14,20,1),(27,9,1,8,60,1),(28,9,2,8,57.5,1),(29,9,3,7,55,1),(30,9,4,6,52.5,1),(31,10,1,10,32.5,1),(32,10,2,9,30,1),(33,10,3,8,27.5,1),(34,11,1,12,22,1),(35,11,2,11,19.5,1),(36,11,3,10,17,1),(37,12,1,15,25,1),(38,12,2,15,22.5,1),(39,12,3,14,20,1),(40,13,1,8,62.5,1),(41,13,2,8,60,1),(42,13,3,7,57.5,1),(43,13,4,6,55,1),(44,14,1,10,35,1),(45,14,2,9,32.5,1),(46,14,3,8,30,1),(47,15,1,12,22,1),(48,15,2,11,19.5,1),(49,15,3,10,17,1),(50,16,1,15,25,1),(51,16,2,15,22.5,1),(52,16,3,14,20,1);
/*!40000 ALTER TABLE `setlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'noga','test12@gmail.com','$2b$10$J78NXo3ClvpwrZv.C/X0oum6ormg/d6w0km2jk1CQNBfXXA2Qr4R.','2026-07-12 16:36:42.240'),(2,'noga','test123@gmail.com','$2b$10$N2HIyYnBJHrfMsrLlEHFH.Li84qNvNghzyvxmrujQHxaptvXwNSGq','2026-07-12 16:37:27.767'),(3,'debug test','debugtest999@test.com','$2b$10$pnqcyhzxPIEJ1jXRVsVOs.ebAemmfS3YLIsLCJ/6ry3dFCWYlxg/W','2026-07-12 17:57:34.360'),(4,'Andrej','andrej12@test.hr','$2b$10$n9/yZO5y88Z7Z7RTpRaFtOQNhiPfG6SzZ9Mi8F49bMYvwR483Enj6','2026-07-12 18:04:56.539'),(5,'andrija','andrej@gmail.com','$2b$10$H9FU6Qn05RtZhDpFhnapu.srp4FGmmAAwB0wf9t6vvFHBaAJdMkWO','2026-08-30 21:36:39.849'),(6,'Ana Kovac','demo1788128039@gym.hr','$2b$10$0tlVbOID3kOqOE3aV0awtuslzUZSWcNGRnfRwsYGULSO.2M.xc4t.','2026-08-30 22:13:59.926'),(7,'andrej smiljanic','sasamatic@gmail.com','$2b$10$JUWeuKiwk3LyhFmsZIxK9e57LvCIslECAfQA1AtqhHK32q.wtaq76','2026-08-31 10:41:04.798');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutplan`
--

DROP TABLE IF EXISTS `workoutplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutplan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `WorkoutPlan_userId_fkey` (`userId`),
  CONSTRAINT `WorkoutPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutplan`
--

LOCK TABLES `workoutplan` WRITE;
/*!40000 ALTER TABLE `workoutplan` DISABLE KEYS */;
INSERT INTO `workoutplan` VALUES (1,2,'Noga','','2026-07-12 16:38:35.110'),(2,6,'Push A','Prsa, ramena, triceps','2026-08-30 22:14:40.745'),(3,6,'Pull A','Leđa i biceps','2026-08-30 22:14:40.788');
/*!40000 ALTER TABLE `workoutplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutplanexercise`
--

DROP TABLE IF EXISTS `workoutplanexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutplanexercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `planId` int NOT NULL,
  `exerciseId` int NOT NULL,
  `order` int NOT NULL,
  `targetSets` int DEFAULT NULL,
  `targetReps` int DEFAULT NULL,
  `targetWeight` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `WorkoutPlanExercise_planId_fkey` (`planId`),
  KEY `WorkoutPlanExercise_exerciseId_fkey` (`exerciseId`),
  CONSTRAINT `WorkoutPlanExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `exercise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `WorkoutPlanExercise_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `workoutplan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutplanexercise`
--

LOCK TABLES `workoutplanexercise` WRITE;
/*!40000 ALTER TABLE `workoutplanexercise` DISABLE KEYS */;
INSERT INTO `workoutplanexercise` VALUES (1,1,13,0,3,10,3),(2,2,1,0,4,8,60),(3,2,11,0,3,10,35),(4,2,2,0,3,12,22),(5,2,15,0,3,15,25),(6,3,7,0,3,5,100),(7,3,9,0,4,8,55),(8,3,10,0,3,12,45),(9,3,14,0,3,12,15);
/*!40000 ALTER TABLE `workoutplanexercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutsession`
--

DROP TABLE IF EXISTS `workoutsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutsession` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `planId` int DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `startedAt` datetime(3) DEFAULT NULL,
  `endedAt` datetime(3) DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `WorkoutSession_userId_fkey` (`userId`),
  KEY `WorkoutSession_planId_fkey` (`planId`),
  CONSTRAINT `WorkoutSession_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `workoutplan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `WorkoutSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutsession`
--

LOCK TABLES `workoutsession` WRITE;
/*!40000 ALTER TABLE `workoutsession` DISABLE KEYS */;
INSERT INTO `workoutsession` VALUES (1,6,2,'2026-08-09 00:00:00.000','2026-08-30 22:14:40.869',NULL,'Dobar trening, energija na vrhuncu.','2026-08-30 22:14:40.871'),(2,6,2,'2026-08-16 00:00:00.000','2026-08-30 22:14:40.902',NULL,'Dobar trening, energija na vrhuncu.','2026-08-30 22:14:40.904'),(3,6,2,'2026-08-23 00:00:00.000','2026-08-30 22:14:40.925',NULL,'Dobar trening, energija na vrhuncu.','2026-08-30 22:14:40.926'),(4,6,2,'2026-08-28 00:00:00.000','2026-08-30 22:14:40.954',NULL,'Dobar trening, energija na vrhuncu.','2026-08-30 22:14:40.956');
/*!40000 ALTER TABLE `workoutsession` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 12:51:31
