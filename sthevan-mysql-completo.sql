-- ============================================================
-- Sthevan Dev — MySQL completo (Hostinger / phpMyAdmin)
-- Banco: u586160337_sthevandev
-- ============================================================
-- COMO USAR:
-- 1. hPanel → phpMyAdmin
-- 2. Clique no banco u586160337_sthevandev (esquerda)
-- 3. Aba "SQL" → cole TODO este arquivo → Executar
--    OU Aba "Importar" → escolha este arquivo → Executar
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Clientes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_name` VARCHAR(150) NOT NULL,
  `site_name` VARCHAR(150) NOT NULL,
  `url` VARCHAR(255) NOT NULL DEFAULT '',
  `monthly_value` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('ativo','pausado','cancelado') NOT NULL DEFAULT 'ativo',
  `due_day` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `start_date` DATE DEFAULT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_client_name` (`client_name`),
  KEY `idx_due_day` (`due_day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Se a tabela já existia sem due_day, adiciona a coluna
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'clients'
    AND COLUMN_NAME = 'due_day'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `clients` ADD COLUMN `due_day` TINYINT UNSIGNED NOT NULL DEFAULT 5 AFTER `status`',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- --------------------------------------------------------
-- Admin do painel
-- Login: 01  |  Senha: Sh2308
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `admin_users`;
INSERT INTO `admin_users` (`username`, `password_hash`) VALUES
('01', '$2y$10$NGDKHX1lc87.eWezr0G1auk.ob5hnwTLhrYmwf/vNxtMQ/9Dj/QM2');

-- --------------------------------------------------------
-- Clientes / mensalidades
-- Aurora 50 dia 5 | Veríssimo 70 dia 5 | Pipoca 50 dia 5
-- Gimarry 50 dia 15 | Veronica 50 dia 5
-- --------------------------------------------------------
DELETE FROM `clients` WHERE `client_name` IN (
  'Aurora Confeitaria',
  'Veríssimo Pratas',
  'Pipoca',
  'Gimarry',
  'Veronica'
);

INSERT INTO `clients`
(`client_name`, `site_name`, `url`, `monthly_value`, `status`, `due_day`, `start_date`, `notes`)
VALUES
('Aurora Confeitaria', 'Aurora Confeitaria', 'https://auroraconfeitaria.com.br', 50.00, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5'),
('Veríssimo Pratas', 'Veríssimo Pratas', 'https://verissimopratas.com.br', 70.00, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5'),
('Pipoca', 'Pipoca', '', 50.00, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5'),
('Gimarry', 'Gimarry Bolos', 'https://gimarrybolos.com.br', 50.00, 'ativo', 15, CURDATE(), 'Mensalidade vence dia 15'),
('Veronica', 'Veronica', '', 50.00, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5');

SET FOREIGN_KEY_CHECKS = 1;
