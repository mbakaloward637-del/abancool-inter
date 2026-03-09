<?php
/**
 * Environment Configuration — Abancool Technology
 * Copy this file to env.php and fill in your values.
 * NEVER commit env.php to version control.
 */

return [
    // ─── Database ────────────────────────────────────────────────
    'DB_HOST'     => 'localhost',
    'DB_PORT'     => '3306',
    'DB_NAME'     => 'abancoo1_webdb',
    'DB_USER'     => 'abancoo1_labo',
    'DB_PASSWORD' => '',
    'DB_DRIVER'   => 'mysql', // 'mysql' or 'pgsql'

    // ─── JWT / Auth ──────────────────────────────────────────────
    'JWT_SECRET'  => '',
    'SUPABASE_URL'        => 'https://kmlvoshucegiybipqpll.supabase.co',
    'SUPABASE_ANON_KEY'   => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbHZvc2h1Y2VnaXliaXBxcGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTY2OTgsImV4cCI6MjA4ODU3MjY5OH0.1PkCCx5inKcrgtSp_oMY5eYJQcTqQXl8X2E2NNIZ_co',
    'SUPABASE_JWT_SECRET' => '',

    // ─── Frontend ────────────────────────────────────────────────
    'FRONTEND_URL' => 'https://abancool.com',

    // ─── M-Pesa (PRODUCTION) ─────────────────────────────────────
    'MPESA_API_URL'            => 'https://api.safaricom.co.ke',
    'MPESA_CONSUMER_KEY'       => '',
    'MPESA_CONSUMER_SECRET'    => '',
    'MPESA_SHORTCODE'          => '000772',
    'MPESA_PASSKEY'            => '',
    'MPESA_INITIATOR_NAME'     => 'apiuser',
    'MPESA_SECURITY_CREDENTIAL'=> '',
    'MPESA_CALLBACK_URL'       => 'https://abancool.com/backend/api/payments/mpesa/callback',
    'MPESA_VALIDATION_URL'     => 'https://abancool.com/backend/api/payments/validation_url.php',
    'MPESA_CONFIRMATION_URL'   => 'https://abancool.com/backend/api/payments/confirmation_url.php',
    'MPESA_CALLBACK_ALLOWED_IPS' => '41.90.115.0,41.223.34.0',
    'MPESA_ENV'                => 'production',

    // ─── Stripe (Optional) ───────────────────────────────────────
    'STRIPE_SECRET_KEY'     => '',
    'STRIPE_WEBHOOK_SECRET' => '',

    // ─── WHM / cPanel ────────────────────────────────────────────
    'WHM_HOST'  => 'server.abancool.com',
    'WHM_PORT'  => '2087',
    'WHM_TOKEN' => '',

    // ─── DirectAdmin (Optional) ──────────────────────────────────
    'DA_HOST'           => 'da.abancool.com',
    'DA_PORT'           => '2222',
    'DA_ADMIN_USER'     => 'admin',
    'DA_ADMIN_PASSWORD' => '',
    'DA_API_KEY'        => '',

    // ─── WHMCS (Optional) ────────────────────────────────────────
    'WHMCS_URL'            => '',
    'WHMCS_API_IDENTIFIER' => '',
    'WHMCS_API_SECRET'     => '',

    // ─── SMTP Email ──────────────────────────────────────────────
    'SMTP_HOST'       => 'mail.abancool.com',
    'SMTP_PORT'       => '587',
    'SMTP_USER'       => '',
    'SMTP_PASS'       => '',
    'SMTP_FROM_EMAIL' => 'support1@abancool.com',
    'SMTP_FROM_NAME'  => 'Abancool Technology',

    // ─── Google OAuth (Optional) ─────────────────────────────────
    'GOOGLE_CLIENT_ID' => '',

    // ─── App Settings ────────────────────────────────────────────
    'APP_NAME'    => 'Abancool Technology',
    'APP_ENV'     => 'production', // 'production' or 'development'
    'APP_DEBUG'   => false,
    'LOG_LEVEL'   => 'error', // 'debug', 'info', 'warning', 'error'
];
