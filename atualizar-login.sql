-- Troca o login do painel
-- Usuário: 01 | Senha: Sh2308
-- Cole no phpMyAdmin → banco u586160337_sthevandev → SQL → Executar

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
