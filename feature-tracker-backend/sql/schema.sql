-- Adminer 5.4.1 MySQL 8.0.45-0ubuntu0.24.04.1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `feature_tracker`;
USE `feature_tracker`;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `feature_requests`;
CREATE TABLE `feature_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `priority` enum('Low','Medium','High') DEFAULT 'Medium',
  `status` enum('Open','In Progress','Completed') DEFAULT 'Open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `feature_requests` (`id`, `title`, `description`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(2,	'Improve login security',	'Add 2FA authentication',	'High',	'In Progress',	'2026-03-23 11:26:37',	'2026-03-23 11:26:37'),
(3,	'Add export feature',	'Export data as PDF/Excel',	'Medium',	'Completed',	'2026-03-23 11:26:37',	'2026-03-23 11:26:37'),
(4,	'Mobile responsiveness',	'Improve UI on small screens',	'Medium',	'Open',	'2026-03-23 11:26:37',	'2026-03-23 11:26:37'),
(5,	'Search functionality',	'Search features by keyword',	'Low',	'Open',	'2026-03-23 11:26:37',	'2026-03-23 11:26:37'),
(6,	'Add Screenshoot of Feature',	'Add an image of the feature you want to implement, either screenshoot or mockup',	'Medium',	'In Progress',	'2026-03-23 12:35:14',	'2026-03-23 13:04:43');

-- 2026-03-25 06:44:38 UTC