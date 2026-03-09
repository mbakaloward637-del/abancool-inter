<?php
/**
 * POST /api/hosting/order
 * Create a new hosting order + invoice.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();
$input = jsonInput();

$planId = $input['plan_id'] ?? null;
$domain = trim($input['domain'] ?? '');
$billingCycle = $input['billing_cycle'] ?? 'yearly';

if (!$planId || !$domain) {
    jsonResponse(['error' => 'plan_id and domain are required'], 400);
}

// Get plan
$stmt = db()->prepare("SELECT * FROM hosting_plans WHERE id = :id AND is_active = 1");
$stmt->execute(['id' => $planId]);
$plan = $stmt->fetch();

if (!$plan) {
    jsonResponse(['error' => 'Plan not found or inactive'], 404);
}

// Calculate amount
$amount = $billingCycle === 'monthly' ? $plan['price_monthly'] : ($plan['price_yearly'] ?? $plan['price_monthly'] * 10);

// Check for existing active order on same domain
$existCheck = db()->prepare("
    SELECT id FROM hosting_orders WHERE domain = :domain AND status = 'active'
");
$existCheck->execute(['domain' => $domain]);
if ($existCheck->fetch()) {
    jsonResponse(['error' => 'An active hosting order already exists for this domain'], 400);
}

// Create hosting order
$orderStmt = db()->prepare("
    INSERT INTO hosting_orders (user_id, plan_id, domain, billing_cycle, amount_paid, status)
    VALUES (:uid, :pid, :domain, :cycle, 0, 'pending')
");
$orderStmt->execute([
    'uid'    => $userId,
    'pid'    => $planId,
    'domain' => $domain,
    'cycle'  => $billingCycle,
]);
$orderId = db()->lastInsertId();

// Create invoice
$invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(substr(md5($orderId), 0, 6));
$invoiceStmt = db()->prepare("
    INSERT INTO invoices (user_id, invoice_number, amount, service_type, service_description, due_at, status)
    VALUES (:uid, :num, :amount, 'hosting', :desc, DATE_ADD(NOW(), INTERVAL 3 DAY), 'unpaid')
");
$invoiceStmt->execute([
    'uid'    => $userId,
    'num'    => $invoiceNumber,
    'amount' => $amount,
    'desc'   => $plan['name'] . ' Hosting — ' . $domain . ' (' . $billingCycle . ')',
]);
$invoiceId = db()->lastInsertId();

// Send invoice email
try {
    $profileStmt = db()->prepare("SELECT * FROM profiles WHERE id = :id");
    $profileStmt->execute(['id' => $userId]);
    $profile = $profileStmt->fetch();

    if ($profile && $profile['email']) {
        $email = new EmailService();
        $email->sendInvoice(
            $profile['email'],
            $profile['name'] ?? 'Customer',
            $invoiceNumber,
            $amount,
            date('M d, Y', strtotime('+3 days')),
            $plan['name'] . ' Hosting — ' . $domain
        );
    }
} catch (Exception $e) {
    appLog('Invoice email failed: ' . $e->getMessage(), 'error');
}

jsonResponse([
    'success'    => true,
    'order_id'   => $orderId,
    'invoice_id' => $invoiceId,
    'invoice_number' => $invoiceNumber,
    'amount'     => $amount,
], 201);
