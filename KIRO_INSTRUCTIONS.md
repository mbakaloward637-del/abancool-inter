# Kiro AI Instructions — Abancool Technology Backend Deployment

## Project Overview
This is a **web hosting company website** with:
- React frontend (Lovable-hosted at https://abancool.com)
- PHP backend API (deploy to cPanel at /backend/)
- MySQL database (abancoo1_webdb)
- M-Pesa LIVE payments (Safaricom Daraja API)
- WHM/cPanel auto-provisioning

---

## STEP 1: Create env.php on cPanel

Navigate to `/home/abancoo1/public_html/backend/config/` and create `env.php`:

```php
<?php
return [
    // Database
    'DB_HOST'     => 'localhost',
    'DB_PORT'     => '3306',
    'DB_NAME'     => 'abancoo1_webdb',
    'DB_USER'     => 'abancoo1_labo',
    'DB_PASSWORD' => 'Labankhisa2030',
    'DB_DRIVER'   => 'mysql',

    // JWT / Supabase Auth
    'JWT_SECRET'          => 'abancool_jwt_secret_key_2026_change_this_in_production_to_256bit_random_string',
    'SUPABASE_URL'        => 'https://kmlvoshucegiybipqpll.supabase.co',
    'SUPABASE_ANON_KEY'   => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbHZvc2h1Y2VnaXliaXBxcGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTY2OTgsImV4cCI6MjA4ODU3MjY5OH0.1PkCCx5inKcrgtSp_oMY5eYJQcTqQXl8X2E2NNIZ_co',
    'SUPABASE_JWT_SECRET' => '', // Get from Supabase Dashboard > Settings > API > JWT Secret

    // Frontend
    'FRONTEND_URL' => 'https://abancool.com',

    // M-Pesa PRODUCTION
    'MPESA_API_URL'             => 'https://api.safaricom.co.ke',
    'MPESA_CONSUMER_KEY'        => 'QwzCGC1fTPluVAXeNjxFTTDXsjklVKeL',
    'MPESA_CONSUMER_SECRET'     => '6Uc2GeVcZBUGWHGT',
    'MPESA_SHORTCODE'           => '000772',
    'MPESA_PASSKEY'             => 'b309881157d87125c7f87ffffde6448ab10f90e3dce7c4d8efab190482896018',
    'MPESA_INITIATOR_NAME'      => 'apiuser',
    'MPESA_SECURITY_CREDENTIAL' => 'QiHDv6Xqs1Ar/2ARMEqsHcide3ZluYbGxcrWdAPFoPZaG/NYuDU1vdkWBwgB3cHb7ltnL+ILmLk7oHBWywAiXWzypPoCPMPC8iQtYq/lhHwFDwz0ZnLyR/zW+naBtizbjSSDRrv9r1CBbn6jjq7lx+drMXfVTqJ7R8IhKCVPjFk/PZ0KXf1/3Tmr3cCO5gbbe7PdmAWY7mTIiaDDY4UydJqP3nGho7EgEUvciEmkNgMTmMWfSwaXIB8uCmRyP7CXIbIyoJ2CBOzoOupKGmVuPBgubYPHvcocULtgnVAzOlWYFiOIXqSd59KSfcGMytr1MLhOyEncS9epwFNEfgJhTQ==',
    'MPESA_CALLBACK_URL'        => 'https://abancool.com/backend/api/payments/mpesa-callback.php',
    'MPESA_VALIDATION_URL'      => 'https://abancool.com/backend/api/payments/validation_url.php',
    'MPESA_CONFIRMATION_URL'    => 'https://abancool.com/backend/api/payments/confirmation_url.php',
    'MPESA_CALLBACK_ALLOWED_IPS'=> '41.90.115.0,41.223.34.0',
    'MPESA_ENV'                 => 'production',

    // Stripe (Optional)
    'STRIPE_SECRET_KEY'     => '',
    'STRIPE_WEBHOOK_SECRET' => '',

    // WHM/cPanel
    'WHM_HOST'  => 'server.abancool.com',
    'WHM_PORT'  => '2087',
    'WHM_TOKEN' => '', // Generate in WHM > Manage API Tokens

    // SMTP
    'SMTP_HOST'       => 'mail.abancool.com',
    'SMTP_PORT'       => '587',
    'SMTP_USER'       => 'support1@abancool.com',
    'SMTP_PASS'       => 'Abancool2030',
    'SMTP_FROM_EMAIL' => 'support1@abancool.com',
    'SMTP_FROM_NAME'  => 'Abancool Technology',

    // App
    'APP_NAME'  => 'Abancool Technology',
    'APP_ENV'   => 'production',
    'APP_DEBUG' => false,
    'LOG_LEVEL' => 'error',
];
```

---

## STEP 2: Import Database Schema

In cPanel → phpMyAdmin → Select `abancoo1_webdb` → Import → Upload `backend/database/schema.sql`

This creates:
- `profiles` - User profiles linked to Supabase auth
- `hosting_plans` - 4 pre-seeded plans (Starter, Business, Premium, Enterprise)
- `hosting_orders` - Customer orders with cPanel credentials
- `invoices` - Billing invoices
- `payments` - M-Pesa/Stripe transactions
- `domains` - Registered domains
- `support_tickets` + `ticket_replies` - Support system
- `contact_messages` - Contact form submissions

---

## STEP 3: Upload Backend Files

Upload entire `backend/` folder to:
```
/home/abancoo1/public_html/backend/
```

Final structure:
```
public_html/
└── backend/
    ├── .htaccess
    ├── index.php
    ├── config/
    │   ├── bootstrap.php
    │   └── env.php          ← YOU CREATE THIS
    ├── api/
    │   ├── health.php
    │   ├── auth/
    │   ├── cpanel/
    │   ├── contact/
    │   ├── domains/
    │   ├── hosting/
    │   ├── invoices/
    │   ├── payments/
    │   ├── provisioning/
    │   ├── support/
    │   └── whmcs/
    ├── services/
    │   ├── WHMService.php
    │   ├── DirectAdminService.php
    │   ├── WHMCSService.php
    │   └── EmailService.php
    ├── database/
    │   └── schema.sql
    └── logs/                ← Auto-created
```

---

## STEP 4: Set Permissions

```bash
chmod 644 config/env.php
chmod 755 .htaccess
mkdir -p logs
chmod 755 logs
```

---

## STEP 5: Test Endpoints

```bash
# Health check (no auth)
curl https://abancool.com/backend/api/health.php
# Expected: {"status":"ok","database":"connected","timestamp":"..."}

# Hosting plans (no auth)
curl https://abancool.com/backend/api/hosting/plans.php
# Expected: Array of 4 plans

# Authenticated endpoint (needs JWT)
curl https://abancool.com/backend/api/auth/profile.php \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

---

## STEP 6: Configure M-Pesa on Daraja Portal

1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Navigate to your LIVE app
3. Set URLs:
   - **Validation URL**: `https://abancool.com/backend/api/payments/validation_url.php`
   - **Confirmation URL**: `https://abancool.com/backend/api/payments/confirmation_url.php`
4. STK Push Callback: `https://abancool.com/backend/api/payments/mpesa-callback.php`
5. Whitelist server IP address

---

## STEP 7: Generate WHM API Token (For Auto-Provisioning)

1. Login to WHM at `server.abancool.com:2087`
2. Go to **Development** → **Manage API Tokens**
3. Create new token with permissions:
   - `create-acct`
   - `passwd`
   - `accountsummary`
   - `showbw`
4. Copy token to `env.php` → `WHM_TOKEN`

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health.php` | No | Health check |
| GET | `/api/hosting/plans.php` | No | List hosting plans |
| POST | `/api/contact/submit.php` | No | Submit contact form |
| GET | `/api/auth/profile.php` | JWT | Get user profile |
| POST | `/api/auth/update-profile.php` | JWT | Update profile |
| GET | `/api/cpanel/status.php` | JWT | Check hosting status |
| GET | `/api/cpanel/stats.php` | JWT | Resource usage |
| GET | `/api/cpanel/sso.php` | JWT | SSO auto-login URL |
| GET | `/api/invoices/list.php` | JWT | User invoices |
| GET | `/api/domains/list.php` | JWT | User domains |
| POST | `/api/hosting/order.php` | JWT | Create order |
| POST | `/api/payments/mpesa-stk.php` | JWT | M-Pesa STK Push |
| POST | `/api/payments/mpesa-callback.php` | IP | Safaricom callback |
| POST | `/api/payments/stripe-intent.php` | JWT | Stripe PaymentIntent |
| POST | `/api/payments/stripe-webhook.php` | Sig | Stripe webhook |
| GET/POST | `/api/support/tickets.php` | JWT | Support tickets |
| GET/POST | `/api/support/replies.php` | JWT | Ticket replies |
| POST | `/api/provisioning/provision.php` | Internal | Auto-provision |

---

## Payment Flow

```
User selects plan → Creates hosting_order (pending) + invoice (unpaid)
  → User clicks "Pay with M-Pesa"
  → STK Push sent to phone
  → User enters PIN
  → Safaricom callback → payment=completed, invoice=paid
  → Auto-provision triggered → cPanel account created
  → Email sent to user with credentials
  → Dashboard shows real stats + SSO login
```

---

## Kiro Development Rules

1. **NEVER commit `config/env.php`** — contains secrets
2. **All API calls go through `src/lib/api.ts`** — never raw `fetch()` in components
3. **All PHP endpoints use `authenticate()`** for protected routes
4. **All SQL uses prepared statements** — NEVER string concatenation
5. **Every `api.ts` function has Supabase fallback** for resilience
6. **NEVER edit** `src/integrations/supabase/client.ts` or `types.ts`
7. **Use `appLog()`** for PHP logging, never `echo`/`print`
8. **Use `EmailService`** for all notifications
9. **M-Pesa callbacks verify by IP**, Stripe by signature
10. **Add new endpoints**: create PHP file → test → add to `api.ts`

---

## Troubleshooting

### 500 Error on API
- Check `backend/logs/` for error files
- Verify `env.php` exists and has correct DB credentials
- Test DB connection in phpMyAdmin

### M-Pesa Not Working
- Verify callback URLs in Daraja portal match exactly
- Check server IP is whitelisted
- Review `logs/mpesa_*.json` files

### CORS Errors
- Ensure `.htaccess` is uploaded correctly
- Check `FRONTEND_URL` in env.php matches your domain

### Auth Failures
- Verify `SUPABASE_JWT_SECRET` is set (get from Supabase Dashboard)
- Check JWT token is being sent in Authorization header

---

## Security Checklist

- [ ] `env.php` permissions 644
- [ ] `.htaccess` blocks `/config/`, `/logs/`, `/services/`
- [ ] CORS restricted to `abancool.com`
- [ ] Rate limiting on M-Pesa endpoints
- [ ] SSL certificate active
- [ ] No secrets in frontend code
- [ ] Prepared statements everywhere

---

## Next Steps After Deployment

1. Test health endpoint
2. Test hosting plans endpoint
3. Create test user account
4. Test M-Pesa payment flow (use test number first)
5. Verify auto-provisioning creates cPanel account
6. Test SSO login to cPanel
7. Publish frontend on Lovable
