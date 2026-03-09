<?php
/**
 * GET/POST /api/support/replies?ticket_id=xxx
 * List replies or add a reply to a ticket.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $ticketId = $_GET['ticket_id'] ?? null;
    if (!$ticketId) jsonResponse(['error' => 'ticket_id required'], 400);

    // Verify ownership
    $ticketStmt = db()->prepare("SELECT id FROM support_tickets WHERE id = :id AND user_id = :uid");
    $ticketStmt->execute(['id' => $ticketId, 'uid' => $userId]);
    if (!$ticketStmt->fetch()) jsonResponse(['error' => 'Ticket not found'], 404);

    $stmt = db()->prepare("
        SELECT * FROM ticket_replies 
        WHERE ticket_id = :tid 
        ORDER BY created_at ASC
    ");
    $stmt->execute(['tid' => $ticketId]);
    jsonResponse(['replies' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = jsonInput();
    $ticketId = $input['ticket_id'] ?? null;
    $message = trim($input['message'] ?? '');

    if (!$ticketId || !$message) {
        jsonResponse(['error' => 'ticket_id and message required'], 400);
    }

    // Verify ownership
    $ticketStmt = db()->prepare("SELECT id FROM support_tickets WHERE id = :id AND user_id = :uid");
    $ticketStmt->execute(['id' => $ticketId, 'uid' => $userId]);
    if (!$ticketStmt->fetch()) jsonResponse(['error' => 'Ticket not found'], 404);

    $stmt = db()->prepare("
        INSERT INTO ticket_replies (ticket_id, user_id, message, is_staff)
        VALUES (:tid, :uid, :msg, false)
    ");
    $stmt->execute([
        'tid' => $ticketId,
        'uid' => $userId,
        'msg' => $message,
    ]);

    // Update ticket updated_at
    db()->prepare("UPDATE support_tickets SET updated_at = NOW() WHERE id = :id")->execute(['id' => $ticketId]);

    jsonResponse(['success' => true], 201);
}

jsonResponse(['error' => 'Method not allowed'], 405);
