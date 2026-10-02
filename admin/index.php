<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';
require_auth();

$pdo = db();
$flash = '';
$flashType = 'ok';
$editing = null;

$statuses = ['ativo', 'pausado', 'cancelado'];

// ---- Actions ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify($_POST['csrf'] ?? null)) {
        $flash = 'Sessão expirada. Tente novamente.';
        $flashType = 'error';
    } else {
        $action = $_POST['action'] ?? '';

        if ($action === 'delete') {
            $id = (int) ($_POST['id'] ?? 0);
            if ($id > 0) {
                $stmt = $pdo->prepare('DELETE FROM clients WHERE id = ?');
                $stmt->execute([$id]);
                $flash = 'Cliente removido.';
            }
        }

        if ($action === 'save') {
            $id = (int) ($_POST['id'] ?? 0);
            $clientName = trim((string) ($_POST['client_name'] ?? ''));
            $siteName = trim((string) ($_POST['site_name'] ?? ''));
            $url = trim((string) ($_POST['url'] ?? ''));
            $monthly = (float) str_replace(',', '.', (string) ($_POST['monthly_value'] ?? '0'));
            $status = (string) ($_POST['status'] ?? 'ativo');
            $startDate = trim((string) ($_POST['start_date'] ?? ''));
            $notes = trim((string) ($_POST['notes'] ?? ''));

            if (!in_array($status, $statuses, true)) {
                $status = 'ativo';
            }

            if ($clientName === '' || $siteName === '') {
                $flash = 'Nome do cliente e do site são obrigatórios.';
                $flashType = 'error';
            } else {
                $startDateSql = $startDate !== '' ? $startDate : null;

                if ($id > 0) {
                    $stmt = $pdo->prepare(
                        'UPDATE clients SET client_name=?, site_name=?, url=?, monthly_value=?, status=?, start_date=?, notes=? WHERE id=?'
                    );
                    $stmt->execute([$clientName, $siteName, $url, $monthly, $status, $startDateSql, $notes, $id]);
                    $flash = 'Cliente atualizado.';
                } else {
                    $stmt = $pdo->prepare(
                        'INSERT INTO clients (client_name, site_name, url, monthly_value, status, start_date, notes) VALUES (?,?,?,?,?,?,?)'
                    );
                    $stmt->execute([$clientName, $siteName, $url, $monthly, $status, $startDateSql, $notes]);
                    $flash = 'Cliente adicionado.';
                }
            }
        }
    }
}

// Edit load
if (isset($_GET['edit'])) {
    $editId = (int) $_GET['edit'];
    $stmt = $pdo->prepare('SELECT * FROM clients WHERE id = ?');
    $stmt->execute([$editId]);
    $editing = $stmt->fetch() ?: null;
}

$openForm = $editing !== null || isset($_GET['new']);

// Filters
$q = trim((string) ($_GET['q'] ?? ''));
$filter = (string) ($_GET['status'] ?? 'todos');
if (!in_array($filter, array_merge(['todos'], $statuses), true)) {
    $filter = 'todos';
}

$sql = 'SELECT * FROM clients WHERE 1=1';
$params = [];

if ($filter !== 'todos') {
    $sql .= ' AND status = ?';
    $params[] = $filter;
}
if ($q !== '') {
    $sql .= ' AND (client_name LIKE ? OR site_name LIKE ? OR url LIKE ? OR notes LIKE ?)';
    $like = '%' . $q . '%';
    array_push($params, $like, $like, $like, $like);
}
$sql .= ' ORDER BY status ASC, client_name ASC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$clients = $stmt->fetchAll();

// Stats
$statsRow = $pdo->query(
    "SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'ativo' THEN 1 ELSE 0 END) AS active,
        COALESCE(SUM(CASE WHEN status = 'ativo' THEN monthly_value ELSE 0 END), 0) AS mrr
     FROM clients"
)->fetch();

$total = (int) ($statsRow['total'] ?? 0);
$active = (int) ($statsRow['active'] ?? 0);
$mrr = (float) ($statsRow['mrr'] ?? 0);
$yearly = $mrr * 12;

$user = auth_user();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin — Clientes | Sthevan Dev</title>
  <link rel="stylesheet" href="admin.css" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Sora:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body class="adm">
  <header class="adm-top">
    <div class="adm-top-left">
      <a class="adm-back" href="/">← Site</a>
      <div>
        <p class="adm-eyebrow">Sthevan Dev · <?= e($user['username'] ?? '') ?></p>
        <h1>Clientes & mensalidades</h1>
      </div>
    </div>
    <div class="adm-top-actions">
      <a class="adm-btn adm-btn-primary" href="?new=1">+ Novo cliente</a>
      <a class="adm-btn" href="logout.php">Sair</a>
    </div>
  </header>

  <?php if ($flash): ?>
    <p class="adm-flash adm-flash-<?= e($flashType) ?>"><?= e($flash) ?></p>
  <?php endif; ?>

  <section class="adm-stats">
    <article class="adm-stat">
      <div>
        <span>Clientes</span>
        <strong><?= $total ?></strong>
      </div>
    </article>
    <article class="adm-stat">
      <div>
        <span>Ativos</span>
        <strong><?= $active ?></strong>
      </div>
    </article>
    <article class="adm-stat adm-stat-accent">
      <div>
        <span>Receita mensal</span>
        <strong><?= money_br($mrr) ?></strong>
      </div>
    </article>
    <article class="adm-stat">
      <div>
        <span>Projeção anual</span>
        <strong><?= money_br($yearly) ?></strong>
      </div>
    </article>
  </section>

  <section class="adm-toolbar">
    <form class="adm-search" method="get">
      <?php if ($filter !== 'todos'): ?>
        <input type="hidden" name="status" value="<?= e($filter) ?>" />
      <?php endif; ?>
      <input type="search" name="q" value="<?= e($q) ?>" placeholder="Buscar cliente, site ou URL…" />
      <button type="submit" class="adm-btn">Buscar</button>
    </form>
    <div class="adm-filters">
      <?php foreach (['todos', 'ativo', 'pausado', 'cancelado'] as $s): ?>
        <a class="adm-chip<?= $filter === $s ? ' is-active' : '' ?>"
           href="?status=<?= urlencode($s) ?><?= $q !== '' ? '&q=' . urlencode($q) : '' ?>">
          <?= e($s) ?>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <section class="adm-table-wrap">
    <?php if (!$clients): ?>
      <div class="adm-empty">
        <p>Nenhum cliente encontrado.</p>
        <a class="adm-btn adm-btn-primary" href="?new=1">Adicionar primeiro cliente</a>
      </div>
    <?php else: ?>
      <table class="adm-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Site</th>
            <th>Valor mensal</th>
            <th>Status</th>
            <th>Desde</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($clients as $c): ?>
            <tr>
              <td>
                <strong><?= e($c['client_name']) ?></strong>
                <?php if ($c['notes']): ?>
                  <span class="adm-notes"><?= e($c['notes']) ?></span>
                <?php endif; ?>
              </td>
              <td>
                <div class="adm-site">
                  <span><?= e($c['site_name']) ?></span>
                  <?php if ($c['url']): ?>
                    <a href="<?= e($c['url']) ?>" target="_blank" rel="noopener"><?= e(preg_replace('#^https?://#', '', $c['url'])) ?></a>
                  <?php else: ?>
                    <span class="adm-muted">sem URL</span>
                  <?php endif; ?>
                </div>
              </td>
              <td class="adm-money"><?= money_br($c['monthly_value']) ?></td>
              <td><span class="adm-status adm-status-<?= e($c['status']) ?>"><?= e($c['status']) ?></span></td>
              <td><?= e(format_date_br($c['start_date'])) ?></td>
              <td class="adm-row-actions">
                <a class="adm-icon-btn" href="?edit=<?= (int) $c['id'] ?>" title="Editar">✎</a>
                <form method="post" onsubmit="return confirm('Remover este cliente?');" style="display:inline">
                  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />
                  <input type="hidden" name="action" value="delete" />
                  <input type="hidden" name="id" value="<?= (int) $c['id'] ?>" />
                  <button type="submit" class="adm-icon-btn adm-icon-danger" title="Excluir">✕</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </section>

  <?php if ($openForm): ?>
    <div class="adm-modal-backdrop">
      <div class="adm-modal" role="dialog" aria-modal="true">
        <h2><?= $editing ? 'Editar cliente' : 'Novo cliente' ?></h2>
        <form method="post" class="adm-form">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />
          <input type="hidden" name="action" value="save" />
          <input type="hidden" name="id" value="<?= (int) ($editing['id'] ?? 0) ?>" />

          <label>
            Nome do cliente
            <input name="client_name" required value="<?= e($editing['client_name'] ?? '') ?>" placeholder="Ex: João Silva" />
          </label>
          <label>
            Nome do site
            <input name="site_name" required value="<?= e($editing['site_name'] ?? '') ?>" placeholder="Ex: Aurora Confeitaria" />
          </label>
          <label>
            URL
            <input name="url" value="<?= e($editing['url'] ?? '') ?>" placeholder="https://" />
          </label>
          <div class="adm-form-row">
            <label>
              Valor mensal (R$)
              <input type="number" name="monthly_value" min="0" step="0.01"
                     value="<?= e((string) ($editing['monthly_value'] ?? '0')) ?>" />
            </label>
            <label>
              Status
              <select name="status">
                <?php foreach ($statuses as $s): ?>
                  <option value="<?= e($s) ?>" <?= (($editing['status'] ?? 'ativo') === $s) ? 'selected' : '' ?>>
                    <?= e(ucfirst($s)) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </label>
          </div>
          <label>
            Data de início
            <input type="date" name="start_date" value="<?= e($editing['start_date'] ?? date('Y-m-d')) ?>" />
          </label>
          <label>
            Observações
            <textarea name="notes" rows="3" placeholder="Plano, domínio, hospedagem…"><?= e($editing['notes'] ?? '') ?></textarea>
          </label>
          <div class="adm-form-actions">
            <a class="adm-btn" href="index.php">Cancelar</a>
            <button type="submit" class="adm-btn adm-btn-primary"><?= $editing ? 'Salvar' : 'Adicionar' ?></button>
          </div>
        </form>
      </div>
    </div>
  <?php endif; ?>
</body>
</html>
