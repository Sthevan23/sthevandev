<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/auth.php';
require_auth();
logout_admin();
header('Location: login.php');
exit;
