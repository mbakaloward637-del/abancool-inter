

# WHMCS Client Portal Rebuild

## Overview
Complete rebuild of the client portal to use WHMCS as the backend engine. Remove Supabase auth, replace the sidebar dashboard with a wide hosting-portal layout, and proxy all data through secure edge functions.

## Important Note
The stored secret name has a typo: `WHMCS_IDENTFIER` (missing an "I"). This needs to be corrected to `WHMCS_IDENTIFIER` or the edge functions must reference the typo-name exactly.

## Architecture

```text
Browser (React SPA)
    │
    ├── Login form POST → https://abancool.com/clients/dologin.php
    │   (WHMCS sets session cookie on abancool.com domain)
    │
    └── Data fetch → Edge Functions (/whmcs-proxy)
            │
            └── WHMCS API (uses WHMCS_IDENTIFIER + WHMCS_SECRET secrets)
                https://abancool.com/clients/includes/api.php
```

**Key constraint**: Since Lovable can't run Express/Node servers, all WHMCS API proxying goes through **edge functions**. The WHMCS API uses server-side credentials (identifier+secret), so the edge function authenticates the *user* via Supabase JWT, then maps them to a WHMCS client ID to make WHMCS API calls on their behalf.

**Auth approach**: Login/register/logout link directly to WHMCS pages. For the portal data pages, we keep a lightweight Supabase session (auto-created on first WHMCS login redirect) so edge functions can identify the user. Alternatively, the portal pages can work as **read-only views** that embed WHMCS iframes for actions (manage, pay, etc.).

## Plan

### 1. Create WHMCS Proxy Edge Function
- **`supabase/functions/whmcs-proxy/index.ts`**
- Accepts POST with `{ action, params }` + Supabase JWT auth header
- Reads `WHMCS_IDENTFIER` and `WHMCS_SECRET` from Deno env
- Calls WHMCS API at `https://abancool.com/clients/includes/api.php`
- Supports actions: `GetClientsProducts`, `GetClientsDomains`, `GetInvoices`, `GetTickets`, `GetOrders`, `GetClientsDetails`, `UpdateClient`, `OpenTicket`
- Maps authenticated user email → WHMCS client ID via `GetClients` search

### 2. Create WHMCS API Client (`src/lib/whmcs-api.ts`)
- Replace `src/lib/api.ts` with WHMCS-focused client
- All calls go to the edge function endpoint
- Functions: `fetchServices()`, `fetchDomains()`, `fetchInvoices()`, `fetchTickets()`, `fetchOrders()`, `fetchProfile()`, `updateProfile()`, `openTicket()`

### 3. New Client Portal Layout (`src/pages/client/ClientPortalLayout.tsx`)
- Wide layout: `max-w-[1400px] mx-auto px-8 py-10`
- Reuses website Header + Footer (Layout wrapper)
- Horizontal tab navigation: Dashboard | Services | Domains | Billing | Tickets | Orders | Account
- No sidebar

### 4. Rebuild Login Page (`src/pages/client/ClientLoginPage.tsx`)
- Remove all Supabase/Lovable auth
- Simple form that POSTs to `https://abancool.com/clients/dologin.php`
- Registration link → `https://abancool.com/clients/register.php`
- Forgot password link → `https://abancool.com/clients/pwreset.php`

### 5. Rebuild All Client Pages
Replace existing pages with WHMCS-powered versions:

| Page | WHMCS Action | Key Features |
|------|-------------|--------------|
| **Dashboard** | Multiple | Summary cards (services count, domains, unpaid invoices, open tickets), recent activity |
| **Services** | `GetClientsProducts` | Wide table with manage links to WHMCS |
| **Domains** | `GetClientsDomains` | Table with expiry, auto-renew, manage links |
| **Billing** | `GetInvoices` | Invoice table with pay links to WHMCS |
| **Tickets** | `GetTickets` / `OpenTicket` | Ticket list + new ticket form |
| **Orders** | `GetOrders` | Order history table |
| **Account** | `GetClientsDetails` / `UpdateClient` | Profile view + edit form |

### 6. Update Routes (`src/App.tsx`)
```text
/client/login          → ClientLoginPage (WHMCS form)
/client/dashboard      → ClientPortalLayout wrapper
  /client/dashboard           → Dashboard
  /client/services            → Services
  /client/domains             → Domains  
  /client/billing             → Billing
  /client/tickets             → Tickets
  /client/orders              → Orders
  /client/account             → Account
```

### 7. Update Public Pages
- Hosting page "Order Now" buttons → `https://abancool.com/clients/cart.php?a=add&pid={id}`
- Domain search form → POST to `https://abancool.com/clients/cart.php?a=add&domain=register`
- Header "Client Area" link stays at `/client/login`

### 8. Design Tokens
- Primary: `#0B1C2D` (dark navy)
- Accent: `#FF8C00` (orange)  
- Background: `#F6F8FB` (light gray)
- Large cards, wide tables, spacious padding
- Hosting portal style (HostAfrica / Hostinger inspired)

### 9. Files to Delete/Remove
- Remove Supabase auth references from all client pages
- Remove `ClientDashboardLayout.tsx` (sidebar layout)
- Remove `ClientCpanel.tsx`, `ClientPayments.tsx` (not needed with WHMCS)

## Technical Considerations
- Edge function handles WHMCS credential security — never exposed to frontend
- User identification: edge function looks up WHMCS client by email from Supabase JWT
- Action buttons (manage service, pay invoice) redirect to WHMCS client area URLs
- The existing PHP backend files can remain but won't be used by the new portal

