<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';
require_auth();

$pdo = db();
$flash = '';
$flashType = 'ok';
$editing = null;

$statuses = ['ativo', 'pausado', 'cancelado'];

function ensure_client_columns(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $due = $pdo->query("SHOW COLUMNS FROM clients LIKE 'due_day'")->fetch();
    if (!$due) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN due_day TINYINT UNSIGNED NOT NULL DEFAULT 5 AFTER status");
    }
    $paid = $pdo->query("SHOW COLUMNS FROM clients LIKE 'paid'")->fetch();
    if (!$paid) {
        $pdo->exec("ALTER TABLE clients ADD COLUMN paid TINYINT(1) NOT NULL DEFAULT 0 AFTER due_day");
    }
    $done = true;
}

ensure_client_columns($pdo);

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

        if ($action === 'set_paid') {
            $id = (int) ($_POST['id'] ?? 0);
            $paid = (int) ($_POST['paid'] ?? 0) === 1 ? 1 : 0;
            if ($id > 0) {
                $stmt = $pdo->prepare('UPDATE clients SET paid = ? WHERE id = ?');
                $stmt->execute([$paid, $id]);
                $flash = $paid ? 'Marcado como pago.' : 'Marcado como ainda não pago.';
            }
        }

        if ($action === 'save') {
            $id = (int) ($_POST['id'] ?? 0);
            $clientName = trim((string) ($_POST['client_name'] ?? ''));
            $siteName = trim((string) ($_POST['site_name'] ?? ''));
            $url = trim((string) ($_POST['url'] ?? ''));
            $monthly = (float) str_replace(',', '.', (string) ($_POST['monthly_value'] ?? '0'));
            $status = (string) ($_POST['status'] ?? 'ativo');
            $dueDay = (int) ($_POST['due_day'] ?? 5);
            $paid = (int) ($_POST['paid'] ?? 0) === 1 ? 1 : 0;
            $startDate = trim((string) ($_POST['start_date'] ?? ''));
            $notes = trim((string) ($_POST['notes'] ?? ''));

            if (!in_array($status, $statuses, true)) {
                $status = 'ativo';
            }
            if ($dueDay < 1 || $dueDay > 31) {
                $dueDay = 5;
            }

            if ($clientName === '' || $siteName === '') {
                $flash = 'Nome do cliente e do site são obrigatórios.';
                $flashType = 'error';
            } else {
                $startDateSql = $startDate !== '' ? $startDate : null;

                if ($id > 0) {
                    $stmt = $pdo->prepare(
                        'UPDATE clients SET client_name=?, site_name=?, url=?, monthly_value=?, status=?, due_day=?, paid=?, start_date=?, notes=? WHERE id=?'
                    );
                    $stmt->execute([$clientName, $siteName, $url, $monthly, $status, $dueDay, $paid, $startDateSql, $notes, $id]);
                    $flash = 'Cliente atualizado.';
                } else {
                    $stmt = $pdo->prepare(
                        'INSERT INTO clients (client_name, site_name, url, monthly_value, status, due_day, paid, start_date, notes) VALUES (?,?,?,?,?,?,?,?,?)'
                    );
                    $stmt->execute([$clientName, $siteName, $url, $monthly, $status, $dueDay, $paid, $startDateSql, $notes]);
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
        COALESCE(SUM(CASE WHEN status = 'ativo' THEN monthly_value ELSE 0 END), 0) AS mrr,
        SUM(CASE WHEN status = 'ativo' AND paid = 1 THEN 1 ELSE 0 END) AS paid_count,
        SUM(CASE WHEN status = 'ativo' AND paid = 0 THEN 1 ELSE 0 END) AS unpaid_count
     FROM clients"
)->fetch();

$total = (int) ($statsRow['total'] ?? 0);
$active = (int) ($statsRow['active'] ?? 0);
$mrr = (float) ($statsRow['mrr'] ?? 0);
$paidCount = (int) ($statsRow['paid_count'] ?? 0);
$unpaidCount = (int) ($statsRow['unpaid_count'] ?? 0);

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
        <span>Pagos / pendentes</span>
        <strong><?= $paidCount ?> / <?= $unpaidCount ?></strong>
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
            <th>Vence</th>
            <th>Pagamento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($clients as $c): ?>
            <?php $isPaid = (int) ($c['paid'] ?? 0) === 1; ?>
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
              <td>dia <?= (int) ($c['due_day'] ?? 5) ?></td>
              <td>
                <div class="adm-pay-btns">
                  <form method="post">
                    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />
                    <input type="hidden" name="action" value="set_paid" />
                    <input type="hidden" name="id" value="<?= (int) $c['id'] ?>" />
                    <input type="hidden" name="paid" value="1" />
                    <button type="submit" class="adm-pay-btn adm-pay-ok<?= $isPaid ? ' is-active' : '' ?>">
                      Pago
                    </button>
                  </form>
                  <form method="post">
                    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>" />
                    <input type="hidden" name="action" value="set_paid" />
                    <input type="hidden" name="id" value="<?= (int) $c['id'] ?>" />
                    <input type="hidden" name="paid" value="0" />
                    <button type="submit" class="adm-pay-btn adm-pay-pending<?= !$isPaid ? ' is-active' : '' ?>">
                      Ainda não
                    </button>
                  </form>
                </div>
              </td>
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
              Dia do vencimento
              <input type="number" name="due_day" min="1" max="31"
                     value="<?= e((string) ($editing['due_day'] ?? '5')) ?>" />
            </label>
          </div>
          <div class="adm-form-row">
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
            <label>
              Pagamento do mês
              <select name="paid">
                <option value="0" <?= ((int) ($editing['paid'] ?? 0) === 0) ? 'selected' : '' ?>>Ainda não</option>
                <option value="1" <?= ((int) ($editing['paid'] ?? 0) === 1) ? 'selected' : '' ?>>Pago</option>
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
