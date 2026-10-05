-- ============================================================
-- Sthevan Dev — Banco de dados (Hostinger / MySQL)
-- ============================================================
-- COMO USAR NA HOSTINGER:
-- 1. hPanel → Bancos de Dados MySQL → Criar banco + usuário
-- 2. phpMyAdmin → selecione o banco → Importar → este arquivo
-- 3. Copie config.example.php para config.php e preencha
-- 4. Acesse https://sthevandev.com.br/admin/setup.php UMA VEZ
--    (cria o usuário admin e depois delete o setup.php)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_name` VARCHAR(150) NOT NULL,
  `site_name` VARCHAR(150) NOT NULL,
  `url` VARCHAR(255) NOT NULL DEFAULT '',
  `monthly_value` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('ativo','pausado','cancelado') NOT NULL DEFAULT 'ativo',
  `due_day` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `paid` TINYINT(1) NOT NULL DEFAULT 0,
  `start_date` DATE DEFAULT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_client_name` (`client_name`),
  KEY `idx_due_day` (`due_day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
