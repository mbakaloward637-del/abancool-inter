<?php
/**
 * GET /api/hosting/plans
 * Return all active hosting plans. Public — no auth required.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$stmt = db()->prepare("SELECT * FROM hosting_plans WHERE is_active = 1 ORDER BY price_monthly ASC");
$stmt->execute();

jsonResponse(['plans' => $stmt->fetchAll()]);
