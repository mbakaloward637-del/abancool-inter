<?php
/**
 * GET /api/invoices/list
 * Return all invoices for the authenticated user.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();

$stmt = db()->prepare("
    SELECT * FROM invoices 
    WHERE user_id = :uid 
    ORDER BY issued_at DESC
");
$stmt->execute(['uid' => $userId]);
$invoices = $stmt->fetchAll();

jsonResponse(['invoices' => $invoices]);
