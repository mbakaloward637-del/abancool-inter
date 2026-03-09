<?php
/**
 * POST /api/auth/update-profile
 * Update the authenticated user's profile.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();
$input = jsonInput();

$allowed = ['name', 'phone', 'company'];
$updates = [];
$params = ['id' => $userId];

foreach ($allowed as $field) {
    if (isset($input[$field])) {
        $updates[] = "{$field} = :{$field}";
        $params[$field] = $input[$field];
    }
}

if (empty($updates)) {
    jsonResponse(['error' => 'No valid fields to update'], 400);
}

$updates[] = "updated_at = NOW()";
$sql = "UPDATE profiles SET " . implode(', ', $updates) . " WHERE id = :id";

$stmt = db()->prepare($sql);
$stmt->execute($params);

jsonResponse(['success' => true, 'message' => 'Profile updated']);
