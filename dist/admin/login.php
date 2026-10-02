<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';

if (auth_user()) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if (!csrf_verify($_POST['csrf'] ?? null)) {
        $error = 'Sessão expirada. Tente de novo.';
    } elseif ($username === '' || $password === '') {
        $error = 'Preencha usuário e senha.';
    } elseif (attempt_login($username, $password)) {
        header('Location: index.php');
        exit;
    } else {
        $error = 'Usuário ou senha incorretos.';
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login — Admin Sthevan Dev</title>
  <link rel="stylesheet" href="admin.css" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Sora:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body class="adm">
  <div class="adm-login">
    <a class="adm-back" href="/">← Voltar ao site</a>
    <div class="adm-login-card">
      <p class="adm-eyebrow">Sthevan Dev</p>
      <h1>Painel admin</h1>
      <p class="adm-login-sub">Clientes e valores mensais dos sites.</p>
      <?php if ($error): ?><p class="adm-error"><?= e($error) ?></p><?php endif; ?>
      <form method="post" class="adm-login-form">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />
        <label>
          Usuário
          <input name="username" autocomplete="username" required autofocus placeholder="01" />
        </label>
        <label>
          Senha
          <input type="password" name="password" autocomplete="current-password" required placeholder="••••••••" />
        </label>
        <button type="submit" class="adm-btn adm-btn-primary">Entrar</button>
      </form>
      <p class="adm-login-hint">Acesso: usuário <strong>01</strong> (não é e-mail)</p>
    </div>
  </div>
</body>
</html>
