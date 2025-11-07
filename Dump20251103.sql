CREATE DATABASE  IF NOT EXISTS `property_manager` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `property_manager`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: property_manager
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_ID` int NOT NULL AUTO_INCREMENT,
  `property_ID` int DEFAULT NULL,
  `unit_ID` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`admin_ID`),
  KEY `property_ID` (`property_ID`),
  KEY `unit_ID` (`unit_ID`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`property_ID`) REFERENCES `properties` (`property_ID`),
  CONSTRAINT `admin_ibfk_2` FOREIGN KEY (`unit_ID`) REFERENCES `properties_units` (`unit_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,1,NULL,'John Mwangi'),(2,2,NULL,'Kevin Wanjohi');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expenses_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int DEFAULT NULL,
  `property_ID` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `description` text,
  `account` varchar(100) DEFAULT NULL,
  `month` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`expenses_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `property_ID` (`property_ID`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`property_ID`) REFERENCES `properties` (`property_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,1,'2025-10-01','09:00:00',5000.00,'Security guard salary','Operations','October'),(2,3,2,'2025-10-02','11:00:00',12000.00,'Water bill','Utilities','October');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `maintenance_ID` int NOT NULL AUTO_INCREMENT,
  `property_ID` int DEFAULT NULL,
  `user_ID` int DEFAULT NULL,
  `tenant_ID` int DEFAULT NULL,
  `unit_ID` int DEFAULT NULL,
  `description` text,
  `date` date DEFAULT NULL,
  `photo_URL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`maintenance_ID`),
  KEY `property_ID` (`property_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `tenant_ID` (`tenant_ID`),
  KEY `unit_ID` (`unit_ID`),
  CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`property_ID`) REFERENCES `properties` (`property_ID`),
  CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  CONSTRAINT `maintenance_ibfk_3` FOREIGN KEY (`tenant_ID`) REFERENCES `users` (`user_ID`),
  CONSTRAINT `maintenance_ibfk_4` FOREIGN KEY (`unit_ID`) REFERENCES `properties_units` (`unit_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (1,1,1,2,1,'Leaking kitchen tap','2025-10-05','tap_issue.jpg'),(2,2,3,4,3,'Broken gate lock','2025-10-03','gate_lock.jpg');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int DEFAULT NULL,
  `property_ID` int DEFAULT NULL,
  `unit_ID` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` enum('early','late','incomplete') DEFAULT 'incomplete',
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `payment_information` text,
  PRIMARY KEY (`payment_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `property_ID` (`property_ID`),
  KEY `unit_ID` (`unit_ID`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`property_ID`) REFERENCES `properties` (`property_ID`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`unit_ID`) REFERENCES `properties_units` (`unit_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2,1,1,45000.00,'early','2025-10-01','08:30:00','Paid via M-Pesa'),(2,4,2,3,60000.00,'late','2025-09-30','10:15:00','Bank transfer');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `property_ID` int NOT NULL AUTO_INCREMENT,
  `property_name` varchar(100) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `description` text,
  `rent` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_URL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`property_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'Almaiza Apartments','Kilimani, Nairobi','Modern 2-bedroom units with parking and security.',45000.00,12000000.00,'almaiza.jpg'),(2,'Greenview Villas','Syokimau, Nairobi','Spacious 3-bedroom maisonettes ideal for families.',60000.00,18000000.00,'greenview.jpg'),(3,'Westlands Heights','Westlands, Nairobi','Luxury apartments with rooftop pool and gym.',85000.00,25000000.00,'westlands.jpg'),(4,'The Romanov','Embakasi South','A very good looking apartment with large balconies',20000.00,20000000.00,'/uploads/properties/68fea41c05942.png');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties_units`
--

DROP TABLE IF EXISTS `properties_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties_units` (
  `unit_ID` int NOT NULL AUTO_INCREMENT,
  `property_ID` int NOT NULL,
  `user_ID` int DEFAULT NULL,
  `tenant_ID` int DEFAULT NULL,
  `unit_name` varchar(100) DEFAULT NULL,
  `rent_price` decimal(10,2) DEFAULT NULL,
  `tenant_status` enum('occupied','pending','unoccupied') DEFAULT 'unoccupied',
  `lease_start_date` date DEFAULT NULL,
  `lease_end_date` date DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`unit_ID`),
  KEY `property_ID` (`property_ID`),
  KEY `user_ID` (`user_ID`),
  KEY `tenant_ID` (`tenant_ID`),
  CONSTRAINT `properties_units_ibfk_1` FOREIGN KEY (`property_ID`) REFERENCES `properties` (`property_ID`),
  CONSTRAINT `properties_units_ibfk_2` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`),
  CONSTRAINT `properties_units_ibfk_3` FOREIGN KEY (`tenant_ID`) REFERENCES `users` (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties_units`
--

LOCK TABLES `properties_units` WRITE;
/*!40000 ALTER TABLE `properties_units` DISABLE KEYS */;
INSERT INTO `properties_units` VALUES (5,1,1,2,'Unit A1',45000.00,'occupied',NULL,NULL,NULL),(6,1,NULL,NULL,'Unit A2',45000.00,'unoccupied',NULL,NULL,NULL),(7,2,NULL,NULL,'Villa B8',60000.00,'occupied',NULL,NULL,NULL),(8,3,NULL,NULL,'Penthouse C1',85000.00,'pending',NULL,NULL,NULL),(9,1,8,8,'Unit M6',120000.00,'occupied','2025-09-09','2026-09-09',10000.00),(10,4,NULL,NULL,'Unit 520',18000.00,'occupied','2025-07-07','2026-07-07',2000.00),(11,4,NULL,NULL,'Unin SVJ',150000.00,'unoccupied','2026-07-07','2028-07-01',20000.00);
/*!40000 ALTER TABLE `properties_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_ID` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John Mwangi','',NULL,NULL,NULL,''),(2,'Aisha Otieno','',NULL,NULL,NULL,''),(3,'Kevin Wanjohi','',NULL,NULL,NULL,''),(4,'Grace Njeri','',NULL,NULL,NULL,''),(5,'Jhonson','infobroris@example.com','070707070755','bruce Wayne','7086060980',''),(6,'last king','iastking@example.com','070740404040','king auther','0808606060',''),(7,'Willia Richian','Rich@example.com','0724708634','wilma forest','09876789876',''),(8,'rolex watch','Rolex@example.com','07267876567','wilfred butler','0984565434565','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-03 18:27:30
