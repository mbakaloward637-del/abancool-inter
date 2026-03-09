# Abancool Technology — Full Deployment Guide
## GitHub Copilot & cPanel Backend Integration

---

## 📁 Project Architecture

```
PROJECT ROOT (React Frontend — Lovable)
├── src/
│   ├── lib/api.ts                    ← Centralized PHP backend API service
│   ├── pages/client/
│   │   ├── ClientCpanel.tsx          ← cPanel/DirectAdmin management (uses api.ts)
│   │   ├── ClientPayments.tsx        ← M-Pesa & Stripe payments (uses api.ts)
│   │   ├── ClientHosting.tsx         ← Hosting plans & purchase flow
│   │   └── DashboardOverview.tsx     ← Dashboard stats
│   └── integrations/supabase/       ← Auto-generated, DO NOT EDIT
│
backend/ (PHP — deploy separately on cPanel)
├── index.php                         ← Router
├── .htaccess                         ← Apache URL rewriting
├── config/
│   ├── bootstrap.php                 ← DB, JWT auth, helpers
│   └── env.example.php               ← Copy to env.php with real values
├── services/
│   ├── WHMService.php                ← WHM/cPanel API wrapper
│   ├── DirectAdminService.php        ← DirectAdmin API wrapper
│   └── WHMCSService.php              ← WHMCS billing sync
├── api/
│   ├── cpanel/
│   │   ├── sso.php                   ← GET /api/cpanel/sso
│   │   ├── stats.php                 ← GET /api/cpanel/stats
│   │   └── status.php                ← GET /api/cpanel/status
│   ├── provisioning/
│   │   └── provision.php             ← POST /api/provisioning/provision
│   ├── payments/
│   │   ├── mpesa-stk.php             ← POST /api/payments/mpesa
│   │   ├── mpesa-callback.php        ← POST /api/payments/mpesa/callback
│   │   ├── stripe-intent.php         ← POST /api/payments/stripe/intent
│   │   └── stripe-webhook.php        ← POST /api/payments/stripe/webhook
│   └── whmcs/
│       └── sync.php                  ← POST /api/whmcs/sync
└── README.md
```

---

## 🚀 STEP 1: Deploy PHP Backend on cPanel

### 1.1 Create Subdomain
In your cPanel → **Subdomains** → create `api.abancool.com`  
Document root: `/home/username/api.abancool.com/`

### 1.2 Upload Backend Files
Upload the entire `backend/` folder contents to `/home/username/api.abancool.com/`

```
api.abancool.com/
├── index.php
├── .htaccess
├── config/
├── services/
├── api/
└── logs/
```

### 1.3 Configure Environment
```bash
cd /home/username/api.abancool.com/config/
cp env.example.php env.php
nano env.php   # Fill in all your real credentials
```

### 1.4 Required env.php Values
```php
return [
    // Database — use your Supabase PostgreSQL connection string
    'DB_HOST'     => 'db.kmlvoshucegiybipqpll.supabase.co',
    'DB_PORT'     => '5432',
    'DB_NAME'     => 'postgres',
    'DB_USER'     => 'postgres',
    'DB_PASSWORD' => 'YOUR_SUPABASE_DB_PASSWORD',

    // Supabase JWT Secret — Settings → API → JWT Secret
    'SUPABASE_JWT_SECRET' => 'YOUR_JWT_SECRET',

    // WHM — from WHM → Manage API Tokens
    'WHM_HOST'  => 'your-server.com',
    'WHM_PORT'  => '2087',
    'WHM_TOKEN' => 'YOUR_WHM_API_TOKEN',

    // M-Pesa — from Safaricom Daraja Portal
    'MPESA_CONSUMER_KEY'    => 'YOUR_KEY',
    'MPESA_CONSUMER_SECRET' => 'YOUR_SECRET',
    'MPESA_SHORTCODE'       => '174379',
    'MPESA_PASSKEY'         => 'YOUR_PASSKEY',
    'MPESA_CALLBACK_URL'    => 'https://api.abancool.com/api/payments/mpesa/callback',
    'MPESA_ENV'             => 'sandbox',  // Change to 'production' when ready

    // Stripe — from Stripe Dashboard → API Keys
    'STRIPE_SECRET_KEY'     => 'sk_test_...',
    'STRIPE_WEBHOOK_SECRET' => 'whsec_...',
];
```

### 1.5 Create Logs Directory & Set Permissions
```bash
mkdir -p /home/username/api.abancool.com/logs
chmod 755 /home/username/api.abancool.com/logs
chmod 644 /home/username/api.abancool.com/config/env.php
```

### 1.6 Install SSL
In cPanel → **SSL/TLS** → ensure `api.abancool.com` has a valid SSL certificate.

### 1.7 Test Backend
```bash
# Health check (should return JSON)
curl https://api.abancool.com/api/cpanel/status \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN"

# Should return: {"error":"No active hosting found","redirect":"/client/dashboard/hosting"}
# or hosting status if user has active hosting
```

---

## 🗄️ STEP 2: Database Schema Changes

Run these SQL migrations in your database. In Lovable, go to **Cloud View → Database → Run SQL**:

```sql
-- Add panel_type to hosting_plans (cpanel or directadmin)
ALTER TABLE hosting_plans ADD COLUMN IF NOT EXISTS panel_type text DEFAULT 'cpanel';

-- Add WHMCS product mapping
ALTER TABLE hosting_plans ADD COLUMN IF NOT EXISTS whmcs_product_id integer NULL;

-- Add panel_type to hosting_orders
ALTER TABLE hosting_orders ADD COLUMN IF NOT EXISTS panel_type text DEFAULT 'cpanel';

-- Add M-Pesa checkout tracking
ALTER TABLE payments ADD COLUMN IF NOT EXISTS checkout_request_id text NULL;

-- Add WHMCS client mapping
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whmcs_client_id integer NULL;
```

---

## 🌐 STEP 3: Frontend Configuration

### 3.1 Set API Base URL
The frontend uses `src/lib/api.ts` which reads from environment variable:

```
VITE_API_BASE_URL=https://api.abancool.com
```

If this env var is not set, it defaults to `https://api.abancool.com`.

### 3.2 How the Frontend ↔ Backend Connection Works

```
┌─────────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│   React Frontend    │ ───► │   PHP Backend         │ ───► │  WHM / cPanel   │
│   (Lovable)         │      │   (api.abancool.com)  │      │  DirectAdmin    │
│                     │ ◄─── │                       │ ───► │  WHMCS          │
│   src/lib/api.ts    │      │   JWT Auth + CORS     │ ───► │  M-Pesa API     │
│   ↳ getAuthHeaders  │      │   PDO → Supabase DB   │ ───► │  Stripe API     │
│   ↳ apiGet/apiPost  │      │                       │      │                 │
│   ↳ fallback to SB  │      │                       │      │                 │
└─────────────────────┘      └──────────────────────┘      └─────────────────┘
        ↕                            ↕
   Supabase Auth              Supabase PostgreSQL
   (JWT tokens)               (shared database)
```

### 3.3 Fallback Strategy
Every API call in `src/lib/api.ts` has a fallback:
- If PHP backend is **unreachable** → queries Supabase directly
- If PHP backend returns **error** → shows error toast
- M-Pesa without backend → creates local pending payment record
- Stats without backend → builds from plan data in Supabase

---

## 🔐 STEP 4: Security Checklist

### M-Pesa Callback
1. In Safaricom Daraja Portal → set callback URL:
   ```
   https://api.abancool.com/api/payments/mpesa/callback
   ```
2. Consider IP whitelisting Safaricom IPs in `.htaccess`

### Stripe Webhook
1. In Stripe Dashboard → Webhooks → Add endpoint:
   ```
   https://api.abancool.com/api/payments/stripe/webhook
   ```
2. Select event: `payment_intent.succeeded`
3. Copy webhook signing secret to `env.php`

### CORS
The PHP `index.php` already sets:
```
Access-Control-Allow-Origin: *
```
For production, change `*` to your actual frontend domain.

### JWT Verification
The `bootstrap.php` verifies Supabase JWTs using the JWT secret. Ensure it matches your Supabase project.

---

## 🧪 STEP 5: Testing Checklist

### Test 1: Dashboard Loads
1. Login to client dashboard
2. Verify Dashboard Overview shows stats from Supabase
3. Check browser console for any API errors (expected if backend not deployed yet)

### Test 2: cPanel SSO
1. Navigate to `/client/dashboard/cpanel`
2. If no hosting → "Hosting Required" paywall shows
3. If active hosting → click "Open cPanel" → should open WHM SSO URL

### Test 3: M-Pesa Payment
1. Create a hosting order → invoice created
2. Go to Payments → click "Pay Now" on unpaid invoice
3. Enter phone number → click "Send STK Push"
4. In sandbox mode: use Safaricom test credentials
5. Verify polling detects payment confirmation

### Test 4: Stripe Payment
1. Click "Pay Now" → select "Card" tab
2. Should create PaymentIntent via backend
3. Full Stripe.js integration needed for card form

### Test 5: Auto-Provisioning
1. After M-Pesa callback confirms payment:
   - `payments.status` → `completed`
   - `invoices.status` → `paid`
   - `hosting_orders.status` → `active`
   - `hosting_orders.cpanel_username` → populated
2. cPanel page should now show real stats

---

## 📋 GitHub Copilot Instructions

If you're using GitHub Copilot to extend this project, here's what to know:

### File: `backend/config/bootstrap.php`
- Contains `authenticate()` function — ALL protected endpoints call this
- Contains `db()` — PDO singleton connecting to Supabase PostgreSQL
- Contains `decodeJWT()` — validates Supabase HS256 tokens
- **DO NOT** modify the JWT verification logic without updating the secret

### File: `src/lib/api.ts`
- **Single source of truth** for all PHP backend API calls
- Every function has a Supabase fallback — app works even without backend
- Add new endpoints here following the `apiGet`/`apiPost` pattern
- Never put `fetch()` calls directly in components — always go through `api.ts`

### File: `backend/services/WHMService.php`
- `createSession()` → generates one-time SSO URLs (the key feature)
- `createAccount()` → provisions new cPanel accounts
- `getAccountStats()` → returns real disk/bandwidth/email usage
- All methods use cURL with WHM API token auth

### Adding a New API Endpoint
1. Create PHP file in `backend/api/your-feature/endpoint.php`
2. Add route in `backend/index.php` routes array
3. Add TypeScript function in `src/lib/api.ts`
4. Call from React component using the api.ts function

### Common Pitfalls to Avoid
- **Never** store API keys in frontend code or `.env` files
- **Never** edit `src/integrations/supabase/client.ts` or `types.ts`
- **Never** use raw SQL in frontend — use Supabase SDK or api.ts
- **Always** use `authenticate()` in PHP endpoints that need auth
- **Always** use PDO prepared statements in PHP (never raw SQL concatenation)
- **Always** verify Stripe webhook signatures before processing
- **Always** handle the case where PHP backend is unreachable (fallback)

---

## 🔄 Complete Payment Flow

```
User clicks "Purchase Plan"
        │
        ▼
Frontend creates hosting_order (pending) + invoice (unpaid)
        │
        ▼
User goes to Payments page → clicks "Pay Now"
        │
        ├── M-Pesa: POST /api/payments/mpesa
        │   ├── PHP sends STK Push to Safaricom
        │   ├── User approves on phone
        │   ├── Safaricom calls /api/payments/mpesa/callback
        │   ├── Callback updates payment → completed, invoice → paid
        │   ├── Callback calls /api/provisioning/provision
        │   └── Provision creates cPanel account → hosting_order → active
        │
        └── Stripe: POST /api/payments/stripe/intent
            ├── PHP creates Stripe PaymentIntent
            ├── Frontend confirms with Stripe.js
            ├── Stripe calls /api/payments/stripe/webhook
            ├── Webhook updates payment → completed, invoice → paid
            ├── Webhook calls /api/provisioning/provision
            └── Provision creates cPanel account → hosting_order → active
        │
        ▼
User visits cPanel page → sees real stats + SSO auto-login
```

---

## ✅ Production Readiness Checklist

- [ ] PHP backend deployed to `api.abancool.com`
- [ ] `env.php` configured with real credentials
- [ ] SSL certificate active on `api.abancool.com`
- [ ] Database migrations run (panel_type, checkout_request_id columns)
- [ ] Hosting plans seeded in database
- [ ] M-Pesa callback URL registered in Daraja Portal
- [ ] Stripe webhook URL registered in Stripe Dashboard
- [ ] `MPESA_ENV` changed from `sandbox` to `production`
- [ ] CORS restricted to actual frontend domain
- [ ] WHM API token generated and configured
- [ ] Test payment flow end-to-end
- [ ] Test cPanel SSO login
- [ ] Test auto-provisioning after payment
