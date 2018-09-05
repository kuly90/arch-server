
drop database if exists archvietnam;
create database archvietnam;
use archvietnam;

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL auto_increment,
  `title` varchar(160) NOT NULL,
  `body` varchar(3000) NOT NULL,
  `date_create` varchar(20) not null,
  `status` char(1) not null,
  UNIQUE KEY `NEWS_ID_UNIQUE` (`id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(100) not null,
  `message` varchar(255) not null,
  `date_create` varchar(30) not null,
  `status` char(2) not null,
  UNIQUE KEY `CUSTOMERS_ID_UNIQUE` (`id`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;