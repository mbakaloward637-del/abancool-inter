<?php
/**
 * POST /api/payments/validation_url.php
 * M-Pesa C2B Validation URL — Safaricom calls this to validate transactions.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$rawInput = file_get_contents('php://input');
appLog('M-Pesa Validation Request', 'info', ['body' => $rawInput]);

// Validate IP
$allowedIPs = env('MPESA_CALLBACK_ALLOWED_IPS', '');
if ($allowedIPs && !isAllowedIP($allowedIPs)) {
    appLog('M-Pesa validation from unauthorized IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 'warning');
}

$data = json_decode($rawInput, true);

// Accept all valid transactions
jsonResponse([
    'ResultCode'  => 0,
    'ResultDesc'  => 'Accepted',
]);
