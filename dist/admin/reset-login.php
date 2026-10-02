<?php
/**
 * Atualiza login do painel para 01 / Sh2308.
 * Abra UMA VEZ e apague este arquivo.
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/db.php';

header('Content-Type: text/html; charset=utf-8');

try {
    $pdo = db();
    $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      `username` VARCHAR(50) NOT NULL,
      `password_hash` VARCHAR(255) NOT NULL,
      `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `uq_username` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $hash = password_hash('Sh2308', PASSWORD_DEFAULT);
    $pdo->exec('DELETE FROM admin_users');
    $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
    $stmt->execute(['01', $hash]);

    echo '<!DOCTYPE html><html lang="pt-BR"><body style="font-family:sans-serif;background:#16181f;color:#e4e2dc;padding:2rem">';
    echo '<h1>Login atualizado</h1>';
    echo '<p>Usuário: <strong>01</strong></p>';
    echo '<p>Senha: <strong>Sh2308</strong></p>';
    echo '<p style="color:#fbbf24">Apague o arquivo admin/reset-login.php agora.</p>';
    echo '<p><a href="login.php" style="color:#9ec5e8">Ir para o login</a></p>';
    echo '</body></html>';
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Erro: ' . htmlspecialchars($e->getMessage());
}
