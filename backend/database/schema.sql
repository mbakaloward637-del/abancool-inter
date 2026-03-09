-- =====================================================
-- Abancool Technology — MySQL Database Schema
-- Run this on your cPanel MySQL database: abancoo1_webdb
-- =====================================================

-- Profiles (synced from Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    whmcs_client_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hosting Plans
CREATE TABLE IF NOT EXISTS hosting_plans (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) DEFAULT NULL,
    disk_space_gb INT NOT NULL DEFAULT 5,
    bandwidth_gb INT NOT NULL DEFAULT 20,
    email_accounts INT NOT NULL DEFAULT 5,
    `databases` INT NOT NULL DEFAULT 3,
    features JSON DEFAULT NULL,
    panel_type VARCHAR(20) DEFAULT 'cpanel',
    whmcs_product_id INT DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Hosting Orders
CREATE TABLE IF NOT EXISTS hosting_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    domain VARCHAR(255) DEFAULT NULL,
    billing_cycle VARCHAR(20) NOT NULL DEFAULT 'yearly',
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    panel_type VARCHAR(20) DEFAULT 'cpanel',
    cpanel_username VARCHAR(50) DEFAULT NULL,
    cpanel_url VARCHAR(500) DEFAULT NULL,
    payment_method VARCHAR(50) DEFAULT NULL,
    payment_reference VARCHAR(255) DEFAULT NULL,
    starts_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_domain (domain),
    FOREIGN KEY (plan_id) REFERENCES hosting_plans(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Domains
CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    nameservers TEXT DEFAULT 'ns1.abancool.com, ns2.abancool.com',
    auto_renew TINYINT(1) DEFAULT 1,
    registered_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    service_description TEXT DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'unpaid',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP NOT NULL,
    paid_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_number (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    invoice_id VARCHAR(36) DEFAULT NULL,
    method VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'KES',
    status VARCHAR(20) DEFAULT 'pending',
    reference VARCHAR(255) DEFAULT NULL,
    mpesa_receipt VARCHAR(100) DEFAULT NULL,
    checkout_request_id VARCHAR(100) DEFAULT NULL,
    paid_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_invoice (invoice_id),
    INDEX idx_checkout (checkout_request_id),
    INDEX idx_status (status),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(500) NOT NULL,
    department VARCHAR(50) NOT NULL DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    is_staff TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket (ticket_id),
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Seed Hosting Plans
-- =====================================================
INSERT INTO hosting_plans (id, name, slug, description, price_monthly, price_yearly, disk_space_gb, bandwidth_gb, email_accounts, `databases`, features, panel_type) VALUES
(UUID(), 'Starter', 'starter', 'Perfect for personal websites and blogs', 150, 1500, 5, 50, 5, 3, '["1 Website", "Free SSL", "Daily Backups", "cPanel Access"]', 'cpanel'),
(UUID(), 'Business', 'business', 'Ideal for growing businesses', 250, 2500, 20, 200, 25, 10, '["5 Websites", "Free SSL", "Daily Backups", "cPanel Access", "Free Domain", "Priority Support"]', 'cpanel'),
(UUID(), 'Premium', 'premium', 'For high-traffic websites', 400, 4000, 50, 500, 50, 25, '["Unlimited Websites", "Free SSL", "Daily Backups", "cPanel Access", "Free Domain", "Priority Support", "Staging Environment", "SSH Access"]', 'cpanel'),
(UUID(), 'Enterprise', 'enterprise', 'Maximum performance and resources', 600, 6000, 100, 1000, 100, 50, '["Unlimited Websites", "Free SSL", "Real-time Backups", "cPanel Access", "Free Domain", "24/7 Dedicated Support", "Staging Environment", "SSH Access", "Dedicated IP", "Advanced Security"]', 'cpanel')
ON DUPLICATE KEY UPDATE name=name;
