<?php
/**
 * GET /api/health
 * Health check endpoint — no auth required.
 */
require_once __DIR__ . '/../config/bootstrap.php';

$checks = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'php_version' => PHP_VERSION,
    'app' => env('APP_NAME', 'Abancool'),
];

// Test DB connection
try {
    db()->query("SELECT 1");
    $checks['database'] = 'connected';
} catch (Exception $e) {
    $checks['database'] = 'error';
    $checks['status'] = 'degraded';
}

// Check logs directory
$checks['logs_writable'] = is_writable(__DIR__ . '/../logs');

jsonResponse($checks);
