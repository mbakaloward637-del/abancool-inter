<?php
/**
 * GET /api/domains/list
 * Return all domains for the authenticated user.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();

$stmt = db()->prepare("
    SELECT * FROM domains 
    WHERE user_id = :uid 
    ORDER BY created_at DESC
");
$stmt->execute(['uid' => $userId]);
$domains = $stmt->fetchAll();

jsonResponse(['domains' => $domains]);
