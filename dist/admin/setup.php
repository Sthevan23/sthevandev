<?php
/**
 * Setup inicial — rode UMA VEZ após importar o database.sql
 * Cria o usuário admin e depois DELETE este arquivo.
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/db.php';

$done = false;
$error = '';
$defaultUser = '01';
$defaultPass = 'Sh2308';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? $defaultUser));
    $password = (string) ($_POST['password'] ?? '');

    if ($username === '' || strlen($password) < 6) {
        $error = 'Usuário e senha (mín. 6 caracteres) são obrigatórios.';
    } else {
        try {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $pdo = db();

            $count = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
            if ($count > 0) {
                $id = (int) $pdo->query('SELECT id FROM admin_users ORDER BY id ASC LIMIT 1')->fetchColumn();
                $stmt = $pdo->prepare('UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?');
                $stmt->execute([$username, $hash, $id]);
            } else {
                $stmt = $pdo->prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
                $stmt->execute([$username, $hash]);
            }
            $done = true;
        } catch (Throwable $e) {
            $error = 'Erro: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Setup — Sthevan Dev</title>
  <link rel="stylesheet" href="admin.css" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Sora:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body class="adm">
  <div class="adm-login">
    <div class="adm-login-card">
      <p class="adm-eyebrow">Sthevan Dev</p>
      <h1>Setup do painel</h1>
      <?php if ($done): ?>
        <p class="adm-login-sub">Usuário criado com sucesso.</p>
        <p class="adm-warn">Apague o arquivo <strong>admin/setup.php</strong> agora por segurança.</p>
        <a class="adm-btn adm-btn-primary" href="login.php">Ir para o login</a>
      <?php else: ?>
        <p class="adm-login-sub">Crie o usuário admin do painel (rode só uma vez).</p>
        <?php if ($error): ?><p class="adm-error"><?= e($error) ?></p><?php endif; ?>
        <form method="post" class="adm-login-form">
          <label>
            Usuário
            <input name="username" value="<?= e($defaultUser) ?>" required />
          </label>
          <label>
            Senha
            <input type="password" name="password" value="<?= e($defaultPass) ?>" required minlength="6" />
          </label>
          <button type="submit" class="adm-btn adm-btn-primary">Criar admin</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
