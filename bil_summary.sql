-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: 10.212.20.235    Database: ume
-- ------------------------------------------------------
-- Server version	5.5.5-10.8.5-MariaDB

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
-- Table structure for table `bill_summary`
--

DROP TABLE IF EXISTS `bill_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountId` varchar(100) NOT NULL,
  `usageType` varchar(10) NOT NULL,
  `billPeriod` varchar(10) DEFAULT NULL,
  `unitPrice` double DEFAULT 0,
  `unitAmount` double DEFAULT 0,
  `amount` double DEFAULT 0,
  `discount` double DEFAULT 0,
  `fee` double DEFAULT 0,
  `genDate` date DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bill_summary_UN` (`accountId`,`usageType`,`billPeriod`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf32;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_summary`
--

LOCK TABLES `bill_summary` WRITE;
/*!40000 ALTER TABLE `bill_summary` DISABLE KEYS */;
INSERT INTO `bill_summary` VALUES (13,'20230001','disk','2023-03',1.643835616438356,48.24373279824249,2458.4477535542746,101.91780821917799,2356.5299453350967,'2023-04-20','2023-04-19 16:28:07'),(14,'20230001','click','2023-03',0.03,1010,30.299999999999997,0,30.299999999999997,'2023-04-20','2023-04-19 16:28:07'),(15,'20230002','disk','2023-03',1.643835616438356,13.615470573320179,492.39510018582564,72.32876712328769,420.0663330625379,'2023-04-20','2023-04-19 18:39:01'),(16,'20230002','click','2023-03',0.03,139,4.17,0,4.17,'2023-04-20','2023-04-19 18:39:01');
/*!40000 ALTER TABLE `bill_summary` ENABLE KEYS */;
UNLOCK TABLES;
