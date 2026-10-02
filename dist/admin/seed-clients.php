<?php
/**
 * Cadastra os clientes iniciais. Rode UMA VEZ e apague este arquivo.
 * https://sthevandev.com.br/admin/seed-clients.php
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/db.php';

header('Content-Type: text/html; charset=utf-8');

try {
    $pdo = db();

    // Garante tabelas
    $pdo->exec("CREATE TABLE IF NOT EXISTS `clients` (
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
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Adiciona due_day se a tabela já existia sem a coluna
    $cols = $pdo->query("SHOW COLUMNS FROM clients LIKE 'due_day'")->fetch();
    if (!$cols) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN due_day TINYINT UNSIGNED NOT NULL DEFAULT 5 AFTER status");
    }

    $clients = [
        [
            'client_name' => 'Aurora Confeitaria',
            'site_name' => 'Aurora Confeitaria',
            'url' => 'https://auroraconfeitaria.com.br',
            'monthly_value' => 50,
            'due_day' => 5,
            'notes' => 'Mensalidade vence dia 5',
        ],
        [
            'client_name' => 'Veríssimo Pratas',
            'site_name' => 'Veríssimo Pratas',
            'url' => 'https://verissimopratas.com.br',
            'monthly_value' => 70,
            'due_day' => 5,
            'notes' => 'Mensalidade vence dia 5',
        ],
        [
            'client_name' => 'Pipoca',
            'site_name' => 'Pipocando VV',
            'url' => 'https://pipocandovv.com.br',
            'monthly_value' => 50,
            'due_day' => 5,
            'notes' => 'Mensalidade vence dia 5',
        ],
        [
            'client_name' => 'Gimarry',
            'site_name' => 'Gimarry Bolos',
            'url' => 'https://gimarrybolos.com.br',
            'monthly_value' => 50,
            'due_day' => 15,
            'notes' => 'Mensalidade vence dia 15',
        ],
        [
            'client_name' => 'Veronica',
            'site_name' => 'Veronica',
            'url' => '',
            'monthly_value' => 50,
            'due_day' => 5,
            'notes' => 'Mensalidade vence dia 5',
        ],
    ];

    $check = $pdo->prepare('SELECT id FROM clients WHERE site_name = ? OR client_name = ? LIMIT 1');
    $insert = $pdo->prepare(
        'INSERT INTO clients (client_name, site_name, url, monthly_value, status, due_day, start_date, notes)
         VALUES (?, ?, ?, ?, \'ativo\', ?, CURDATE(), ?)'
    );

    $added = [];
    $skipped = [];

    foreach ($clients as $c) {
        $check->execute([$c['site_name'], $c['client_name']]);
        if ($check->fetch()) {
            $skipped[] = $c['site_name'] . ' (já existia)';
            continue;
        }
        $insert->execute([
            $c['client_name'],
            $c['site_name'],
            $c['url'],
            $c['monthly_value'],
            $c['due_day'],
            $c['notes'],
        ]);
        $added[] = $c['site_name'] . ' — R$ ' . number_format((float) $c['monthly_value'], 2, ',', '.') . ' (dia ' . $c['due_day'] . ')';
    }

    echo '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Seed clientes</title>';
    echo '<style>body{font-family:sans-serif;background:#111;color:#eee;padding:2rem} li{margin:.4rem 0} .ok{color:#34d399} .warn{color:#fbbf24}</style></head><body>';
    echo '<h1>Clientes cadastrados</h1>';

    if ($added) {
        echo '<p class="ok">Adicionados:</p><ul>';
        foreach ($added as $line) {
            echo '<li>' . htmlspecialchars($line) . '</li>';
        }
        echo '</ul>';
    } else {
        echo '<p class="warn">Nenhum cliente novo (todos já estavam no banco).</p>';
    }

    if ($skipped) {
        echo '<p class="warn">Ignorados:</p><ul>';
        foreach ($skipped as $line) {
            echo '<li>' . htmlspecialchars($line) . '</li>';
        }
        echo '</ul>';
    }

    echo '<p><strong>Apague o arquivo admin/seed-clients.php agora.</strong></p>';
    echo '<p><a href="login.php" style="color:#9ec5e8">Ir para o login</a></p>';
    echo '</body></html>';
} catch (Throwable $e) {
    http_response_code(500);
    echo '<pre style="color:#ff6b7a;background:#111;padding:1rem">Erro: ' . htmlspecialchars($e->getMessage()) . "\n\n";
    echo "Confira se o config.php está na raiz do site com os dados do MySQL.</pre>";
}
