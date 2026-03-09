<?php
/**
 * POST /api/payments/confirmation_url.php
 * M-Pesa C2B Confirmation URL — Safaricom calls after successful transaction.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$rawInput = file_get_contents('php://input');

// Log raw callback
$logDir = __DIR__ . '/../../logs';
if (!is_dir($logDir)) mkdir($logDir, 0755, true);
file_put_contents("{$logDir}/mpesa_c2b_" . date('Y-m-d_H-i-s') . '.json', $rawInput);

appLog('M-Pesa C2B Confirmation', 'info', ['body' => $rawInput]);

$data = json_decode($rawInput, true);

$transType    = $data['TransactionType'] ?? '';
$transID      = $data['TransID'] ?? '';
$transAmount  = (float) ($data['TransAmount'] ?? 0);
$billRefNo    = $data['BillRefNumber'] ?? ''; // Invoice number
$msisdn       = $data['MSISDN'] ?? '';
$firstName    = $data['FirstName'] ?? '';

if (!$transID || !$transAmount) {
    jsonResponse(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
}

// Find invoice by bill reference number
$stmt = db()->prepare("SELECT * FROM invoices WHERE invoice_number = :ref AND status != 'paid' LIMIT 1");
$stmt->execute(['ref' => $billRefNo]);
$invoice = $stmt->fetch();

if ($invoice) {
    // Create completed payment
    $insertPayment = db()->prepare("
        INSERT INTO payments (user_id, invoice_id, method, amount, currency, status, reference, mpesa_receipt, paid_at)
        VALUES (:uid, :iid, 'mpesa', :amount, 'KES', 'completed', :ref, :receipt, NOW())
    ");
    $insertPayment->execute([
        'uid'     => $invoice['user_id'],
        'iid'     => $invoice['id'],
        'amount'  => $transAmount,
        'ref'     => $transID,
        'receipt' => $transID,
    ]);

    // Mark invoice paid
    $updateInvoice = db()->prepare("UPDATE invoices SET status = 'paid', paid_at = NOW() WHERE id = :id");
    $updateInvoice->execute(['id' => $invoice['id']]);

    // Send payment confirmation email
    try {
        $profileStmt = db()->prepare("SELECT * FROM profiles WHERE id = :id");
        $profileStmt->execute(['id' => $invoice['user_id']]);
        $profile = $profileStmt->fetch();

        if ($profile && $profile['email']) {
            $email = new EmailService();
            $email->sendPaymentConfirmation(
                $profile['email'],
                $profile['name'] ?? 'Customer',
                $transAmount,
                $transID,
                'mpesa'
            );
        }
    } catch (Exception $e) {
        appLog('Email notification failed: ' . $e->getMessage(), 'error');
    }

    // Trigger provisioning if hosting
    if ($invoice['service_type'] === 'hosting') {
        $orderStmt = db()->prepare("
            SELECT id FROM hosting_orders WHERE user_id = :uid AND status = 'pending' ORDER BY created_at DESC LIMIT 1
        ");
        $orderStmt->execute(['uid' => $invoice['user_id']]);
        $order = $orderStmt->fetch();

        if ($order) {
            $updateOrder = db()->prepare("UPDATE hosting_orders SET amount_paid = :amount WHERE id = :id");
            $updateOrder->execute(['amount' => $transAmount, 'id' => $order['id']]);

            $provisionUrl = 'https://abancool.com/backend/api/provisioning/provision';
            $ch = curl_init($provisionUrl);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => json_encode(['hosting_order_id' => $order['id']]),
                CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
                CURLOPT_TIMEOUT        => 60,
            ]);
            curl_exec($ch);
            curl_close($ch);
        }
    }

    appLog("C2B Payment confirmed: {$transID} KSh {$transAmount} for invoice {$billRefNo}", 'info');
} else {
    appLog("C2B Payment received but no matching invoice: {$billRefNo}, TransID: {$transID}", 'warning');
}

jsonResponse(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
