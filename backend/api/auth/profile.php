<?php
/**
 * GET /api/auth/profile
 * Return the authenticated user's profile.
 */
require_once __DIR__ . '/../../config/bootstrap.php';

$userId = authenticate();

$stmt = db()->prepare("SELECT id, name, email, phone, company, avatar_url, created_at FROM profiles WHERE id = :id");
$stmt->execute(['id' => $userId]);
$profile = $stmt->fetch();

if (!$profile) {
    jsonResponse(['error' => 'Profile not found'], 404);
}

jsonResponse(['profile' => $profile]);
