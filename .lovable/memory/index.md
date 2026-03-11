# Memory: index.md
Updated: now

# Abancool Technology Project

## Design System
- Primary: Blue (HSL 210 80% 42%)
- Accent: Blue (HSL 210 80% 42%) — unified blue theme
- Hero BG: Dark navy (HSL 215 30% 11%)
- Fonts: Plus Jakarta Sans (headings), Inter (body)
- Style: Modern hosting platform — spacious, professional
- Section labels: uppercase, blue, with left bar (`.section-label`)
- Cards: `.service-card` with bottom-line hover, `.project-card` with overlay
- Rounded: `rounded-sm` throughout (sharp, industrial feel)
- No dark mode toggle

## Architecture
- WHMCS is the core backend engine (billing.abancool.com)
- Website is only the frontend UI layer
- All hosting, domains, billing, invoices handled by WHMCS API
- WHMCS API URL: https://billing.abancool.com/includes/api.php
- Edge function `whmcs-proxy` handles all WHMCS communication
- Public actions (GetProducts, DomainWhois) don't require auth
- Secrets: WHMCS_IDENTFIER (typo preserved), WHMCS_SECRET
- Users NEVER see WHMCS interface — no redirects to clientarea.php, cart.php

## Structure
- Public site with Layout (Header + Footer)
- Client dashboard at /client/* (wide portal layout, no sidebar)
- Hosting plans fetched dynamically from WHMCS GetProducts
- Domain search uses WHMCS DomainWhois API
- Orders created via WHMCS AddOrder API

## Company
- Abancool Technology, Garissa Kenya
- Phone: 0728825152, Email: info@abancool.com
