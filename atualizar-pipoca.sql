-- Atualiza URL da Pipoca / Pipocando VV
-- Cole no phpMyAdmin → Executar

UPDATE `clients`
SET
  `site_name` = 'Pipocando VV',
  `url` = 'https://pipocandovv.com.br',
  `monthly_value` = 50.00,
  `due_day` = 5,
  `notes` = 'Mensalidade vence dia 5',
  `status` = 'ativo'
WHERE `client_name` = 'Pipoca'
   OR `site_name` LIKE '%Pipoca%'
   OR `site_name` LIKE '%Pipocando%';

-- Se ainda não existir, cria:
INSERT INTO `clients`
(`client_name`, `site_name`, `url`, `monthly_value`, `status`, `due_day`, `start_date`, `notes`)
SELECT 'Pipoca', 'Pipocando VV', 'https://pipocandovv.com.br', 50.00, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5'
WHERE NOT EXISTS (
  SELECT 1 FROM `clients` WHERE `client_name` = 'Pipoca' OR `url` = 'https://pipocandovv.com.br'
);
