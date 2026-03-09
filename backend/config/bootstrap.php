<?php
/**
 * Bootstrap — loads env, DB, helpers, logging, and CORS.
 * Production-ready for cPanel deployment.
 */

// ─── Load Environment ────────────────────────────────────────────
$envFile = __DIR__ . '/env.php';
if (!file_exists($envFile)) {
    http_response_code(500);
    die(json_encode(['error' => 'Server configuration missing. Copy env.example.php to env.php']));
}
$ENV = require $envFile;
$GLOBALS['ENV'] = $ENV;

function env(string $key, $default = null) {
    return $GLOBALS['ENV'][$key] ?? $default;
}

// ─── Error Handling ──────────────────────────────────────────────
if (env('APP_DEBUG', false)) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(E_ERROR | E_PARSE);
}

// ─── Logging ─────────────────────────────────────────────────────
function appLog(string $message, string $level = 'info', array $context = []): void {
    $levels = ['debug' => 0, 'info' => 1, 'warning' => 2, 'error' => 3];
    $configLevel = env('LOG_LEVEL', 'error');
    if (($levels[$level] ?? 0) < ($levels[$configLevel] ?? 0)) return;

    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) mkdir($logDir, 0755, true);

    $entry = sprintf(
        "[%s] [%s] %s %s\n",
        date('Y-m-d H:i:s'),
        strtoupper($level),
        $message,
        $context ? json_encode($context) : ''
    );
    file_put_contents("{$logDir}/app_" . date('Y-m-d') . '.log', $entry, FILE_APPEND | LOCK_EX);
}

// ─── CORS ────────────────────────────────────────────────────────
$allowedOrigins = [
    env('FRONTEND_URL', 'https://abancool.com'),
    'https://abancool.com',
    'https://www.abancool.com',
    'http://localhost:5173',
    'http://localhost:8080',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$origin}");
} else {
    header('Access-Control-Allow-Origin: https://abancool.com');
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─── Database Connection (supports MySQL + PostgreSQL) ───────────
function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $driver = env('DB_DRIVER', 'mysql');
        if ($driver === 'pgsql') {
            $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s',
                env('DB_HOST', 'localhost'), env('DB_PORT', '5432'), env('DB_NAME'));
        } else {
            $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                env('DB_HOST', 'localhost'), env('DB_PORT', '3306'), env('DB_NAME'));
        }
        try {
            $pdo = new PDO($dsn, env('DB_USER'), env('DB_PASSWORD'), [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            appLog('Database connection failed: ' . $e->getMessage(), 'error');
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
    return $pdo;
}

// ─── Request Helpers ─────────────────────────────────────────────
function jsonInput(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ─── JWT Decode & Verify (HS256, Supabase) ───────────────────────
function decodeJWT(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
    if (!$payload) return null;

    // Verify signature with JWT secret
    $secret = env('JWT_SECRET') ?: env('SUPABASE_JWT_SECRET');
    if ($secret) {
        $headerPayload = $parts[0] . '.' . $parts[1];
        $expectedSig = rtrim(strtr(base64_encode(
            hash_hmac('sha256', $headerPayload, $secret, true)
        ), '+/', '-_'), '=');

        if (!hash_equals($expectedSig, $parts[2])) {
            return null;
        }
    }

    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }

    return $payload;
}

// ─── Authenticate Request ────────────────────────────────────────
function authenticate(): string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonResponse(['error' => 'Authorization header required'], 401);
    }

    $payload = decodeJWT($m[1]);
    if (!$payload || empty($payload['sub'])) {
        jsonResponse(['error' => 'Invalid or expired token'], 401);
    }

    return $payload['sub'];
}

// ─── IP Validation Helper ────────────────────────────────────────
function isAllowedIP(string $allowedList): bool {
    $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    $clientIP = explode(',', $clientIP)[0];
    $allowed = array_map('trim', explode(',', $allowedList));
    
    foreach ($allowed as $ip) {
        if (strpos($clientIP, rtrim($ip, '.0')) === 0) return true;
    }
    return false;
}

// ─── Autoload Services ──────────────────────────────────────────
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/../services/' . $class . '.php';
    if (file_exists($file)) require_once $file;
});
