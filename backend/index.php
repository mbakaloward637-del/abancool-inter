<?php
/**
 * Abancool Technology — API Router
 * Routes all /api/* requests to the correct endpoint file.
 */

require_once __DIR__ . '/config/bootstrap.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');

// Remove base path if deployed in a subdirectory (e.g. /backend)
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
if ($basePath && strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

$method = $_SERVER['REQUEST_METHOD'];

// Handle CORS preflight (already done in bootstrap, but just in case)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─── Route Map ───────────────────────────────────────────────────
$routes = [
    'GET' => [
        '/api/health'               => __DIR__ . '/api/health.php',
        '/api/cpanel/sso'           => __DIR__ . '/api/cpanel/sso.php',
        '/api/cpanel/stats'         => __DIR__ . '/api/cpanel/stats.php',
        '/api/cpanel/status'        => __DIR__ . '/api/cpanel/status.php',
        '/api/auth/profile'         => __DIR__ . '/api/auth/profile.php',
        '/api/invoices/list'        => __DIR__ . '/api/invoices/list.php',
        '/api/domains/list'         => __DIR__ . '/api/domains/list.php',
        '/api/support/tickets'      => __DIR__ . '/api/support/tickets.php',
        '/api/support/replies'      => __DIR__ . '/api/support/replies.php',
        '/api/hosting/plans'        => __DIR__ . '/api/hosting/plans.php',
    ],
    'POST' => [
        '/api/provisioning/provision'       => __DIR__ . '/api/provisioning/provision.php',
        '/api/payments/mpesa'               => __DIR__ . '/api/payments/mpesa-stk.php',
        '/api/payments/mpesa/callback'      => __DIR__ . '/api/payments/mpesa-callback.php',
        '/api/payments/validation_url'      => __DIR__ . '/api/payments/validation_url.php',
        '/api/payments/confirmation_url'    => __DIR__ . '/api/payments/confirmation_url.php',
        '/api/payments/stripe/intent'       => __DIR__ . '/api/payments/stripe-intent.php',
        '/api/payments/stripe/webhook'      => __DIR__ . '/api/payments/stripe-webhook.php',
        '/api/whmcs/sync'                   => __DIR__ . '/api/whmcs/sync.php',
        '/api/auth/update-profile'          => __DIR__ . '/api/auth/update-profile.php',
        '/api/support/tickets'              => __DIR__ . '/api/support/tickets.php',
        '/api/support/replies'              => __DIR__ . '/api/support/replies.php',
        '/api/hosting/order'                => __DIR__ . '/api/hosting/order.php',
        '/api/contact/submit'               => __DIR__ . '/api/contact/submit.php',
    ],
];

if (isset($routes[$method][$uri])) {
    require $routes[$method][$uri];
} else {
    http_response_code(404);
    echo json_encode([
        'error' => 'Endpoint not found',
        'path'  => $uri,
        'method' => $method,
        'available_endpoints' => array_merge(
            array_map(fn($k) => "GET {$k}", array_keys($routes['GET'])),
            array_map(fn($k) => "POST {$k}", array_keys($routes['POST']))
        ),
    ]);
}
