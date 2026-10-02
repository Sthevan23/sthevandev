<?php
/** Atualiza cliente Pipoca com URL. Apague depois. */
declare(strict_types=1);
require_once dirname(__DIR__) . '/includes/db.php';
header('Content-Type: text/html; charset=utf-8');

try {
    $pdo = db();
    $stmt = $pdo->prepare(
        "UPDATE clients SET site_name=?, url=?, monthly_value=?, due_day=?, notes=?, status='ativo'
         WHERE client_name='Pipoca' OR site_name LIKE '%Pipoca%' OR site_name LIKE '%Pipocando%'"
    );
    $stmt->execute(['Pipocando VV', 'https://pipocandovv.com.br', 50, 5, 'Mensalidade vence dia 5']);

    if ($stmt->rowCount() === 0) {
        $ins = $pdo->prepare(
            "INSERT INTO clients (client_name, site_name, url, monthly_value, status, due_day, start_date, notes)
             VALUES ('Pipoca', 'Pipocando VV', 'https://pipocandovv.com.br', 50, 'ativo', 5, CURDATE(), 'Mensalidade vence dia 5')"
        );
        $ins->execute();
        echo 'Pipocando VV cadastrada.';
    } else {
        echo 'Pipocando VV atualizada: https://pipocandovv.com.br';
    }
    echo ' — Apague admin/update-pipoca.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Erro: ' . htmlspecialchars($e->getMessage());
}
