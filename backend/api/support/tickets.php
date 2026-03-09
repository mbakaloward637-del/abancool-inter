<?php
/**
 * GET/POST /api/support/tickets
 * List tickets or create a new one.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare("
        SELECT * FROM support_tickets 
        WHERE user_id = :uid 
        ORDER BY created_at DESC
    ");
    $stmt->execute(['uid' => $userId]);
    jsonResponse(['tickets' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = jsonInput();
    $subject = trim($input['subject'] ?? '');
    $department = trim($input['department'] ?? 'general');
    $priority = $input['priority'] ?? 'medium';
    $message = trim($input['message'] ?? '');

    if (!$subject || !$message) {
        jsonResponse(['error' => 'Subject and message are required'], 400);
    }

    $ticketNumber = 'TKT-' . strtoupper(substr(md5(uniqid()), 0, 8));

    $stmt = db()->prepare("
        INSERT INTO support_tickets (user_id, ticket_number, subject, department, priority, status)
        VALUES (:uid, :num, :subject, :dept, :priority, 'open')
    ");
    $stmt->execute([
        'uid'      => $userId,
        'num'      => $ticketNumber,
        'subject'  => $subject,
        'dept'     => $department,
        'priority' => $priority,
    ]);
    $ticketId = db()->lastInsertId();

    // Add initial message as reply
    $replyStmt = db()->prepare("
        INSERT INTO ticket_replies (ticket_id, user_id, message, is_staff)
        VALUES (:tid, :uid, :msg, false)
    ");
    $replyStmt->execute([
        'tid' => $ticketId,
        'uid' => $userId,
        'msg' => $message,
    ]);

    jsonResponse([
        'success'       => true,
        'ticket_id'     => $ticketId,
        'ticket_number' => $ticketNumber,
    ], 201);
}

jsonResponse(['error' => 'Method not allowed'], 405);
