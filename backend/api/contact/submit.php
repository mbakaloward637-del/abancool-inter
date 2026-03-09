<?php
/**
 * POST /api/contact/submit
 * Public contact form submission. No auth required.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$input = jsonInput();

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$message = trim($input['message'] ?? '');

if (!$name || !$email || !$message) {
    jsonResponse(['error' => 'Name, email, and message are required'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Invalid email address'], 400);
}

$stmt = db()->prepare("
    INSERT INTO contact_messages (name, email, phone, message)
    VALUES (:name, :email, :phone, :message)
");
$stmt->execute([
    'name'    => $name,
    'email'   => $email,
    'phone'   => $phone,
    'message' => $message,
]);

// Notify admin
try {
    $emailService = new EmailService();
    $emailService->send(
        env('SMTP_FROM_EMAIL', 'support1@abancool.com'),
        "New Contact: {$name}",
        "<p><strong>From:</strong> {$name} ({$email})</p><p><strong>Phone:</strong> {$phone}</p><p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>"
    );
} catch (Exception $e) {
    appLog('Contact notification email failed: ' . $e->getMessage(), 'error');
}

jsonResponse(['success' => true, 'message' => 'Message sent successfully'], 201);
