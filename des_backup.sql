/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.15-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: des
-- ------------------------------------------------------
-- Server version	10.11.15-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `deports`
--

DROP TABLE IF EXISTS `deports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `deports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deports`
--

LOCK TABLES `deports` WRITE;
/*!40000 ALTER TABLE `deports` DISABLE KEYS */;
/*!40000 ALTER TABLE `deports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hosts`
--

DROP TABLE IF EXISTS `hosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `hosts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fcs` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `host` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hosts`
--

LOCK TABLES `hosts` WRITE;
/*!40000 ALTER TABLE `hosts` DISABLE KEYS */;
INSERT INTO `hosts` VALUES
(1,'Кравченко Екатерина Александровна','des2-ws0021'),
(2,'Казарина','des2-ws005'),
(3,'Золотарева Ольга Владимировна','des2-ws006'),
(4,'Фадеева','des2-ws009'),
(5,'десятов','des2-ws010'),
(6,'Яркова Светлана Анатальевна','192.168.19.67 vnc'),
(7,'Кудымова','des2-ws012'),
(8,'Зеленкина Ольна Ивановна','des2-ws013'),
(9,'Шихарев Алексей Николаевич','des2-ws014'),
(10,'Устинова Елена Сергеевна','des2-ws015'),
(11,'Ульянова Ирина Ивановна','des2-ws016'),
(12,'Шалык Анна Сергеевна','des2-ws018'),
(13,'Чудинова','des2-ws020'),
(14,'Юркина Анна Анатольевна','des2-ws021'),
(16,'	Артемьева Ольга Евгеньевна','des2-ws017'),
(17,'Литвина Людмила Алексеевна','des-ws011'),
(18,'Пушкарев','des2-ws026'),
(19,'Попыванов','des2-ws027'),
(20,'Селиванов','des2-ws028'),
(21,'механики','des2-ws034'),
(22,'Власова','des2-ws042'),
(23,'Васильева Евгения Владимировна','des2-ws043'),
(24,'Кобелева','des2-ws044'),
(25,'Дектерева Елена Сергеевна (Заитова)','des2-ws046'),
(26,'черенев','des2-ws048'),
(27,'Ченцов','des2-ws050'),
(28,'Никонова','des2-ws051'),
(29,'Мороз','uad-ws036'),
(30,'Морозов','des2-ws007'),
(31,'Губицкая','192.168.19.42 (123)'),
(32,'Курышев','des2-ws008'),
(33,'Шестаков а','des-redos-05'),
(34,'Шерстоб','des2-ws031'),
(35,'Шестакова','des2-ws023'),
(36,'Гусев','des-ws014'),
(37,'Шестаков СИ','des2-ws045'),
(38,'Саутина','DES-REDOS-04 (192.168.19.78 PWD:123)'),
(39,'Николаев ','des2-ws033'),
(40,'Рудаков ','des2-ws036'),
(41,'Курышева ','des2-ws040'),
(42,'Пушкарев Д ','des2-ws027'),
(43,'Куимов ','des2-ws032'),
(44,'Механики ','des2-ws034'),
(45,'Дисп ','des2-ws039'),
(46,'Воликов ','des2-ws038'),
(47,'Шестакова','des2-ws035'),
(48,'Склад ','des2-ws037'),
(49,'Дисп2 ','des2-ws049'),
(50,'Арсен','des-ws001'),
(51,'Пьяников','des-ws013'),
(52,'Передернин','des-ws010'),
(53,'Диспетчер ТКО','des2-ws056'),
(54,'Сычкова','des2-ws001'),
(55,'Чудинов','des2-ws032'),
(56,'Нарижный (pwd - 123)','192.168.19.50'),
(57,'Диспетчер ТКО 2','des2-ws052'),
(58,'Аслямова','des-ws017'),
(61,'Тутубалин ИЖ','uad-ws160'),
(74,'Плехов','des-ws003'),
(75,'Склад теплопроводная','des-ws007'),
(76,'Свободный','des2-ws019'),
(77,'Барышева ','des2-ws025'),
(78,'Степанова','des2-ws053'),
(79,'Кокшаров','des-ws002'),
(80,'Гордеев','des2-ws024'),
(81,'Симонов','uad-ws00754984'),
(82,'Мастера Тепло','des-ws005'),
(83,'Булдаков(Мехкалонна 5 )','des2-temp3'),
(84,'Вотинова','des2-ws011'),
(85,'Прораб ТКО','des2-temp2'),
(86,'Вяткина','des2-ws047'),
(87,'Шиляев','des2-ws057'),
(88,'Клепцин','des-ws004'),
(89,'дисп тепло','des-ws009'),
(90,'климов','des2-ws035'),
(91,'Ноут в конференц','uad-nb008'),
(92,'Широкова ','DES-REDOS-07 (192.168.19.146 PWD:123)'),
(93,'Султанова  ','des2-ws055'),
(96,'Новикова ','des2-ws022'),
(97,'Гайнутдинов','des2-ws061'),
(98,'Казарина','des2-ws058'),
(99,'Романова','Des2-ws059'),
(100,'мастера дэс2','des2-ws029'),
(101,'мастер тепло','des-ws006'),
(102,'механик -тепло','des-ws008'),
(103,'диспетчер тепло','des-ws009'),
(104,'механик -тепло 2','des-ws012');
/*!40000 ALTER TABLE `hosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `src` varchar(45) DEFAULT NULL,
  `alt` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `links`
--

LOCK TABLES `links` WRITE;
/*!40000 ALTER TABLE `links` DISABLE KEYS */;
/*!40000 ALTER TABLE `links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone_boock`
--

DROP TABLE IF EXISTS `phone_boock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `phone_boock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fcs` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `post` varchar(255) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `phone_number` varchar(45) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `addres` varchar(45) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  `deport` varchar(45) CHARACTER SET utf16 COLLATE utf16_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone_boock`
--

LOCK TABLES `phone_boock` WRITE;
/*!40000 ALTER TABLE `phone_boock` DISABLE KEYS */;
INSERT INTO `phone_boock` VALUES
(20,'Курышев Денис Александрович','Руководитель',NULL,NULL,'ул.Крупской,5','Руководство'),
(21,'Золотарева Ольга Владмимировна','Приемная','207-05-20 (711)','ovzolotareva@des.permkrai.ru','ул.Крупской,5','Руководство'),
(22,'Морозов Виктор Александрович','Заместитель руководителя (Эксплуатация)','207-15-80 (714)','vamorozov@des.permkrai.ru','ул.Крупской,5 каб.306','Руководство'),
(23,'Шихарев Алексей Николаевич','Заместитель руководителя (Содержание ЦПР)','207-21-49 (доб. 1) 712','anshikharev@des.permkrai.ru','ул.Крупской,5 каб.305','Руководство'),
(24,'Ульянова Ирина Ивановна','Заместитель руководителя (Экономика)','207-31-66 (713)','iiulianova@des.permkrai.ru','ул.Крупской,5 каб.303','Руководство'),
(25,'Гусев Михаил Александрович','Заместитель руководителя (Содержание рег. дорог)','235-71-20 (доб.5079)','magusev@des.permkrai.ru','ул.3-я Теплопроводная, 4','Руководство'),
(26,'Ракинцев Александр Анатольевич','Заместитель руководителя','207-21-49 (доб. 2) 719','aarakintsev@des.permkrai.ru','ул.Крупской,5 каб.304','Руководство'),
(27,'Шерстобитов Андрей Вениаминович','Главный механик','','avsherstobitov@des.permkrai.ru','ул. Ижевская, 25','Руководство'),
(28,'Фадеева Татьяна Сергеевна','Начальник отдела','207-42-86 (доб. 1) 735','tsfadeeva@des.permkrai.ru','ул.Крупской,5 каб.301','Планово-производственный отдел'),
(29,'Васильева Евгения Владимировна','Заместитель начальника отдела','207-42-86 (доб. 2) 731','evvasileva@des.permkrai.ru','ул.Крупской,5 каб.301','Планово-производственный отдел'),
(30,'Зеленкина Ольга Ивановна','Ведущий инженер','207-45-96 (доб. 2) 705','oizelenkina@des.permkrai.ru','ул.Крупской,5 каб.302','Планово-производственный отдел'),
(32,'Дектерева Елена Сергеевна','Ведущий инженер','207-45-96 (доб.4) 718','esdektereva@des.permkrai.ru','ул.Крупской,5 каб.302','Планово-производственный отдел'),
(33,'Кудымова Екатерина Михайловна','Ведущий инженер','207-45-96 (доб.1) 702','emkudymova@des.permkrai.ru','ул.Крупской,5 каб.302','Планово-производственный отдел'),
(34,'   Вотинова Мария Вадимовна','   Ведущий инженер','  ','mvvotinova@des.permkrai.ru','ул.Крупской,5 каб.302','Планово-производственный отдел'),
(35,'Бояршинова Марина Сергеевна','Начальник отдела','207-68-70 (доб. 1) 710','msboiarshinova@des.permkrai.ru','ул.Крупской,5 каб.206','Отдел управления персоналом'),
(36,' Барышева Юлия Ахатовна','Заместитель начальника отдела','207-68-70 (доб. 2) 709','iuabarysheva@des.permkrai.ru','ул.Крупской,5 каб.205','Отдел управления персоналом'),
(37,' ','Главный специалист','','@des.permkrai.ru','ул.Крупской,5 каб.205','Отдел управления персоналом'),
(38,'Новикова Виктория Валерьевна','Ведущий специалист по кадрам','207-68-70 (доб. 3) 732','vvnovikova@des.permkrai.ru','ул.Крупской,5 каб.205','Отдел управления персоналом'),
(40,'Передернин Алексей Витальевич ','Начальник отдела','235-70-23 (доб. 5084)','avperedernin@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел охраны труда'),
(41,' ','Ведущий специалист по охране труда',' ',' ','ул.Крупской,5 каб.101','Отдел охраны труда'),
(42,'Шестакова Елена Николаевна','Начальник отдела','207-41-79 (доб. 1) 716','enshestakova@des.permkrai.ru','ул.Крупской,5 каб.202','Отдел закупок и снабжения'),
(43,'Аслямова Ольга Рашидовна','Заместитель начальника отдела','207-41-79 (доб. 2) 717','orasliamova@des.permkrai.ru','ул.Крупской,5 каб.203','Отдел закупок и снабжения'),
(44,'Власова Анжелика Андреевна','Заместитель начальника отдела','207-41-79 (доб. 2) 725','aavlasova@des.permkrai.ru','ул.Крупской,5 каб.203','Отдел закупок и снабжения'),
(45,'Литвина Людмила Алексеевна','Специалист по материально-техническому снабжению','235-70-30 (доб.5161)','lalitvina@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел закупок и снабжения'),
(46,'Яркова Светлана Анатольевна','Специалист по материально-техническому снабжению','207-41-79 (доб. 4) 704','saiarkova@des.permkrai.ru','ул.Крупской,5 каб.203','Отдел закупок и снабжения'),
(47,'Павлова Елена Юрьевна','Ведущий специалист по закупкам',NULL,'eiupavlova@des.permkrai.ru','','Отдел закупок и снабжения'),
(52,'Устинова Елена Сергеевна','Начальник отдела','207-50-63 (720)','esustinova@des.permkrai.ru','ул.Крупской,5 каб.204','Отдел по управлению имуществом'),
(53,'Хлыбов Юрий Сергеевич','Заместитель начальника отдела',NULL,'iuskhlybov@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел по управлению имуществом'),
(54,'Ченцов Михаил Александрович ','Ведущий инженер',NULL,'machentsov@des.permkrai.ru','ул.Ижевская, 25','Отдел по управлению имуществом'),
(55,'Юркина Анна Анатольевна','Начальник отдела','207-37-05 (доб. 1)708','aaiurkina@des.permkrai.ru','ул.Крупской,5 каб.201','Юридический отдел'),
(56,'Шестаков Сергей Ильич','Ведущий юрисконсульт','207-37-05 (доб. 2)724','sishestakov@des.permkrai.ru','ул.Крупской,5 каб.201','Юридический отдел'),
(57,'Вавилов Никита Андреевич','Начальник отдела','207-45-96 (доб. 5) 700','navavilov@des.permkrai.ru','ул.Крупской,5 каб.102','Отдел информационных технологий '),
(58,'Нарижный Данил Владленович','Системный администратор','207-45-96 (доб. 6) 730','dvnarizhnyi@des.permkrai.ru','ул.Крупской,5 каб.102','Отдел информационных технологий '),
(59,'Кравченко Екатерина Александровна','Начальник отдела','207-63-56 (722)','eakravchenko@des.permkrai.ru','ул.Крупской,5 каб.103','Отдел по связям с общественностью '),
(60,'Шалык Анна Сергеевна','Главный специалист','207-63-56 (707)','asshalyk@des.permkrai.ru','ул.Крупской,5 каб.104','Отдел по связям с общественностью '),
(61,'Никонова Оксана Васильевна','Главный специалист','207-63-56 (707)','ovnikonova@des.permkrai.ru','ул.Крупской,5 каб.104','Отдел по связям с общественностью '),
(62,'Чудинова Елена Ивановна','Ведущий документовед','207-63-56 (707)','eichudinova@des.permkrai.ru','ул.Крупской,5 каб.104','Отдел по связям с общественностью '),
(63,'Селиванов Алексей Владимирович','Начальник участока',NULL,'avselivanov@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(64,'Казарина Альбина Хабибулловна','Ведущий инженер',NULL,'akhkazarina@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(65,'Пушкарев Дмитрий Анатольевич','Производитель работ',NULL,'dapushkarev@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(66,'Гордеев Евгениий Георгиевич','Производитель работ',NULL,'eggordeev@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(67,'Пушкарев Александр Анатольевич','Производитель работ',NULL,'aapushkarev@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(68,'Пьянников Александр Сергеевич','Начальник участка','235-71-87 (доб. 4006)','aspiannikov@des.permkrai.ru','ул.3-я Теплопроводная, 4','Производственный участок №2'),
(69,'Миргунов Арсен Азатович','Производитель работ','235-71-18 (доб. 4005)','aamirgunov@des.permkrai.ru','ул.3-я Теплопроводная, 4','Производственный участок №2'),
(70,'Кучевасов Сергей Валерьевич','Производитель работ',NULL,'svkuchevasov@des.permkrai.ru','ул.3-я Теплопроводная, 4','Производственный участок №2'),
(71,'Коробкин Алексей Сергеевич','Производитель работ',NULL,'askorobkin@des.permkrai.ru','ул.3-я Теплопроводная, 4','Производственный участок №2'),
(72,'Кобелева Ирина Анатольевна','Начальник отдела','721','iakobeleva@des.permkrai.ru','ул.Крупской,5','Отдел производственного контроля'),
(73,'Султанова Мария Владимировна','Ведущий инженер',NULL,'mvsultanova@des.permkrai.ru','ул.Крупской,5','Отдел производственного контроля'),
(74,'Шестаков Андрей Николаевич','Начальник отдела','207-54-70 (733)','anshestakov@des.permkrai.ru','ул.Крупской,5 каб.102','Отдел безопасности дорожного движения'),
(75,'  Гайнутдинов Радик Талгатович','Ведущий инженер',NULL,' rtgainutdinov@des.permkrai.ru','ул.Крупской,5 каб.101','Отдел безопасности дорожного движения'),
(76,'Плехов Андрей Владимирович','Ведущий инженер','235-71-19 (доб.4003)','avplekhov@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел безопасности дорожного движения'),
(77,'Николаев Виталий Александрович','Инженер 1 категории',NULL,'vanikolaev@des.permkrai.ru','ул.Ижевская,25','Отдел безопасности дорожного движения'),
(78,'Губицкая Галина Владимировна','Инженер 1 категории','','gvgubitskaia@des.permkrai.ru','ул.Крупской,5 каб.102','Отдел безопасности дорожного движения'),
(79,'Рудаков Алексей Борисович','Начальник отдела',NULL,'abrudakov@des.permkrai.ru','ул.Ижевская,25','Мехколонна №1'),
(80,'Воликов Дмитрий Владимирович','Начальник отдела',NULL,'dvvolikov@des.permkrai.ru','ул.Ижевская,25','Мехколонна №2'),
(81,'Кокшаров Александр Васильевич','Начальник отдела','235-71-19 (доб.4003)','avkoksharov@des.permkrai.ru','л.3-я Теплопроводная, 4','Мехколонна №3'),
(82,'Тутубалин Игорь Витальевич','Начальник отдела',NULL,'ivtutubalin@des.permkrai.ru','ул.Ижевская, 25','Мехколонна №4'),
(83,'Булдаков Александр Юрьевич','Начальник отдела',NULL,'aiubuldakov@des.permkrai.ru','ул.Крупской,5','Мехколонна №5'),
(84,'Клепцин Вадим Петрович','Начальник участка','235-71-19 (доб.5088)','vpkleptsin@des.permkrai.ru','л.3-я Теплопроводная, 4','Ремонтный участок №2'),
(85,'Десятов Александр Алексеевич','Начальник участка',NULL,'aadesiatov@des.permkrai.ru','ул.Ижевская, 25','Ремонтный участок №1'),
(89,'Романова Светлана Сергеевна','Мастер','','sromanova@des.permkrai.ru','ул.Ижевская, 25','Производственный участок №1'),
(90,'Симонов Владимир Валерьевич','Ведущий специалист по охране окружающей среды','207-05-20 (723)','vvsimonov@des.permkrai.ru','ул.Крупской,5 каб.101','Отдел охраны труда'),
(91,'Заитова Диляра Рафисовна',' Юрисконсульт','','drzaitova@des.permkrai.ru','ул.Крупской,5','Юридический отдел'),
(94,'Шиляев Владимир Юрьевич','Механик','','viushiliaev@des.permkrai.ru','ул.Крупской,5','Мехколонна №5'),
(95,'Степанова Елена Ивановна','Диспетчер','',' eistepanova@des.permkrai.ru','ул.Крупской,5','Мехколонна №5'),
(99,'Загородских Елена Алексеевна','Кладовщик',NULL,'sklad01@des.permkrai.ru','ул.Ижевская, 25','Отдел закупок и снабжения'),
(101,'Сахарова Валентина Абрамова','Кладовщик',NULL,'sklad01@des.permkrai.ru','ул.Ижевская, 25','Отдел закупок и снабжения'),
(102,'Селиванова Валентина Якимовна','Кладовщик','235-71-18(доб.1061)','sklad02@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел закупок и снабжения'),
(103,'Вяткина Ирина Евсеевна','Кладовщик','235-71-18(доб.1061)','sklad02@des.permkrai.ru','ул.3-я Теплопроводная, 4','Отдел закупок и снабжения'),
(104,'Широкова Полина Эдуардовна','Ведущий документовед	',NULL,'peshirokova@des.permkrai.ru','ул.Крупской,5 каб.104','Отдел по связям с общественностью ');
/*!40000 ALTER TABLE `phone_boock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `pwd` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES
(1,'admin','admin'),
(2,'1','1');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-04 15:46:23
