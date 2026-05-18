# TVASTR — Industrial Intelligence, Forged.

A premium product website and customer portal for **Tvastr** — an industrial AI company inspired by the Vedic artisan deity Tvāṣṭṛ. Built with React, Vite, TailwindCSS, Three.js, and Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | TailwindCSS 3 |
| 3D Graphics | Three.js + React Three Fiber + Drei |
| Routing | React Router v6 |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx                  — Fixed top navigation
│   ├── HeroSection.jsx             — Cinematic hero with Three.js forge core
│   ├── AboutSection.jsx            — Company philosophy + Vedic origin story
│   ├── EcosystemSection.jsx        — Product ecosystem flow diagram
│   ├── DeploymentSection.jsx       — On-premise deployment architecture
│   ├── ProductSlider.jsx           — Horizontal product cards (drag/swipe)
│   ├── ProductCard.jsx             — Animated product cards (defect grid, data flow)
│   ├── ContactSection.jsx          — Contact + footer
│   ├── UpgradeBanner.jsx           — Tier-specific upgrade banner (dashboard)
│   ├── LockedProductCard.jsx       — Locked product card with upgrade CTA
│   ├── LockedFeatureBlock.jsx      — Reusable locked feature component
│   ├── LockedScreen.jsx            — Full-page locked screen for restricted routes
│   ├── ProtectedRoute.jsx          — Auth + tier-based route guard
│   └── systems/
│       ├── SystemDetailSection.jsx — Reusable detail section (for system pages)
│       ├── SystemImageBlock.jsx    — Screenshot display component
│       ├── SystemWorkflow.jsx      — Workflow diagram component
│       └── SystemImpactGrid.jsx    — Business impact grid
├── pages/
│   ├── PortalLogin.jsx             — Customer portal login (/portal)
│   ├── PortalDashboard.jsx         — Protected dashboard (/portal/dashboard)
│   ├── PortalDownloads.jsx         — Software downloads (/portal/downloads)
│   └── systems/
│       ├── RejectionAnalysisSystem.jsx  — RAS detail page
│       └── PlantIntelligence.jsx        — PI detail page
├── three/
│   ├── ForgeCore.jsx               — Rotating icosahedron with forge lighting
│   └── FloatingGeometry.jsx        — Floating geometric particles
├── context/
│   ├── AuthContext.jsx             — Supabase auth state + actions
│   └── LicenseContext.jsx          — License tier + capability flags
├── lib/
│   ├── supabaseClient.js           — Supabase client initialization
│   ├── capabilities.js             — Tier-based capability system
│   └── config.js                   — Centralized config (emails, templates)
├── hooks/
│   └── useScrollReveal.js          — Scroll animation hook
├── App.jsx                         — Router + layout root
├── main.jsx                        — React entry point
└── index.css                       — Tailwind + global styles
```

---

## Public Website

The marketing site (`/`) showcases Tvastr's industrial AI systems with a dark industrial aesthetic and 3D visuals.

### Sections

**1. Hero**
- TVASTR wordmark with metallic gradient
- Tagline: "Industrial Intelligence, Forged."
- Three.js animated forge core (rotating icosahedron) + floating geometric particles
- CTA: "Explore Systems"

**2. About**
- Origin story: Named after Tvāṣṭṛ (Vedic artisan deity)
- Company philosophy: ancient craftsmanship meets modern AI
- Three focus pillars:
  - Industrial AI
  - Manufacturing Intelligence
  - Operational Insight
- Vedic yantra-inspired geometric divider

**3. Product Ecosystem**
- Vertical flow diagram showing data transformation:
  - Inspection Images → RAS (AI detection) → Structured Data → Plant Intelligence → Decisions
- Explains how inspection becomes plant-level intelligence

**4. Deployment Model**
- On-premise architecture diagram:
  - Inspection Workstation → RAS → Plant SQL Database → Plant Intelligence Dashboard
- Emphasis on local deployment within plant network (no cloud dependency)

**5. Product Slider**
Two interactive product cards with animated visuals:

- **Rejection Analysis System**
  - Animated defect grid (scanning pattern)
  - Available in Core (standalone) and Enterprise (integrated) configurations
  - Link to: `/systems/rejection-analysis-system`

- **Plant Intelligence**
  - Animated data flow network
  - Requires structured inspection data (Full Stack only)
  - Link to: `/systems/plant-intelligence`

**6. System Detail Pages**
Technical presentation-style pages (exportable as PDF):

- `/systems/rejection-analysis-system` — RAS technical deep-dive with screenshots
- `/systems/plant-intelligence` — PI technical deep-dive with screenshots

Each page includes:
- Problem statement
- Solution architecture
- Application screenshots (inspection, batch processing, analytics, process intelligence)
- Inference engine explanation
- Business impact metrics

**7. Contact**
- Founder: Achintharya Patil
- Email + LinkedIn links
- Footer nav + copyright

---

## Customer Dashboard

Authenticated users access a protected portal at `/portal` with tier-driven features.

### Login (`/portal`)
- Email + password authentication via Supabase Auth
- No self-registration (users created manually)
- "Request Access" link for new customers

### Dashboard (`/portal/dashboard`)

**Upgrade Banner** (tier-specific, hidden for `full_stack`)
- **RAS Core users see:** "Upgrade to RAS Enterprise" with enterprise feature bullets
- **RAS Enterprise users see:** "Upgrade to Full Stack" with PI feature bullets

**Product Cards** (3 cards with tier-driven states)

1. **RAS Core**
   - Badge: "ACTIVE" (all tiers)

2. **RAS Enterprise**
   - Badge: "ACTIVE" (for `ras_enterprise` and `full_stack`)
   - Badge: "INCLUDED" (for `full_stack`)
   - **Locked** for `ras_core` — shows upgrade CTA with feature bullets

3. **Plant Intelligence**
   - Badge: "ACTIVE" (for `full_stack` only)
   - **Locked** for `ras_core` and `ras_enterprise` — shows upgrade CTA with feature bullets

Each active card has a "Download Latest" button linking to `/portal/downloads`.

### Downloads (`/portal/downloads`)
- Latest software versions filtered by user's license tier
- Each version has:
  - Product name + description
  - Version number + release date
  - Release notes (changelog)
  - SHA-256 checksum
  - Download button (generates signed URL from Supabase Storage)
- **Bottom upgrade prompt** (for non-`full_stack` users):
  - "Looking for plant-level analytics?"
  - Promotes Full Stack with feature bullets

### Route Guards
Protected routes (e.g., `/portal/pi`) show a locked screen if user doesn't have the required tier:
- Lock icon
- Title: "Plant Intelligence not enabled"
- Message: "This feature is available in Full Stack deployments."
- CTA: "Upgrade License" button

---

## Tier System

The system uses three license tiers to control feature access:

| Tier | Access |
|------|--------|
| **`ras_core`** | RAS Core only (standalone inspection) |
| **`ras_enterprise`** | RAS Core + RAS Enterprise (integrated with ERP/SQL) |
| **`full_stack`** | All systems (RAS + Plant Intelligence) |

### Capability Logic

Defined in `src/lib/capabilities.js`:

```javascript
export function getCapabilities(tier) {
  return {
    ras_core: true,                          // All tiers have RAS Core
    ras_enterprise: tier !== 'ras_core',     // Enterprise and Full Stack
    plant_intelligence: tier === 'full_stack' // Full Stack only
  }
}
```

### Tier Hierarchy

```
ras_core (1) → ras_enterprise (2) → full_stack (3)
```

Users with higher tiers see "INCLUDED" badges on lower-tier products.

---

## Data Stored in Supabase

### Tables

**`products`**
- Product registry (name, description)
- Example products:
  - Rejection Analysis System
  - Plant Intelligence

**`versions`**
- Software release versions
- Fields:
  - `product_id` — links to products table
  - `version_number` — e.g., "1.3.0"
  - `release_date` — release date
  - `changelog` — release notes
  - `file_path` — path in Storage bucket (e.g., `rejection-analysis-system/1.3.0.zip`)
  - `checksum` — SHA-256 hash for verification
  - `required_tier` — minimum tier required (`ras_core`, `ras_enterprise`, `full_stack`)
  - `includes_pi` — boolean flag (true for PI versions)

**`licenses`**
- User license records
- Fields:
  - `user_id` — links to Supabase Auth `auth.users`
  - `tier` — user's license tier (`ras_core`, `ras_enterprise`, `full_stack`)
  - `license_key` — unique license key
  - `product_id` — links to products table
  - `customer_name` — customer organization name
  - `active` — boolean (license active/inactive)
  - `expiry_date` — license expiration date

**`download_logs`**
- Audit trail of software downloads
- Fields:
  - `license_key` — who downloaded
  - `product_id` — what product
  - `version_number` — which version
  - `timestamp` — when
  - `ip_address` — from where

### Storage

**Bucket: `updates`** (private)
- Stores installer ZIP files
- Structure:
  ```
  updates/
  ├── rejection-analysis-system/
  │   ├── 1.0.0.zip
  │   ├── 1.1.0.zip
  │   └── 1.3.0.zip
  └── plant-intelligence/
      ├── 1.0.0.zip
      └── 1.1.0.zip
  ```
- Downloads served via signed URLs (60-second expiry)
- RLS policy: authenticated users can SELECT (download)

### Row-Level Security (RLS)

- `products` — authenticated users can read
- `versions` — authenticated users can read
- `licenses` — users can read only their own license (`user_id = auth.uid()`)
- Storage `updates` — authenticated users can download files

---

## Configuration Management

All contact emails and email templates are centralized in `src/lib/config.js` for easy maintenance:

```javascript
export const CONFIG = {
  emails: {
    support: 'support@tvastr.ai',              // License upgrades & support
    contact: 'achintharya@gmail.com',          // General contact
    installationSupport: 'support@tvastr.ai'   // Installation help
  },
  emailTemplates: {
    licenseUpgrade: (tier) => ({ subject: '...', body: '...' }),
    portalAccess: { subject: '...', body: '...' },
    installationSupport: { subject: '...', body: '...' }
  }
}
```

**To change contact emails:** Edit values in `src/lib/config.js` — all components will automatically use the updated emails.

---

## Upgrade Funnel

The dashboard includes a complete upgrade funnel to guide users toward higher tiers:

### Components

- **`UpgradeBanner.jsx`** — Top-of-dashboard banner (hidden for full_stack)
- **`LockedProductCard.jsx`** — Product card with lock icon, feature bullets, upgrade CTA
- **`LockedFeatureBlock.jsx`** — Reusable locked feature block (used on downloads page)
- **`LockedScreen.jsx`** — Full-page locked state for restricted routes

### UX Principles

- **Value-focused:** Show what users gain, not what they're missing
- **Professional tone:** Industrial, engineering-focused language
- **Subtle UI:** No aggressive popups or interruptions
- **Consistent styling:** All upgrade CTAs use amber accent (`rgba(245,158,11,...)`)

### CTA Behavior

All upgrade buttons trigger mailto links using centralized config:

```javascript
const template = CONFIG.emailTemplates.licenseUpgrade(requiredTier)
window.location.href = generateMailtoLink(CONFIG.emails.support, template.subject, template.body)
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#0a0a0b` (charcoal-950) |
| Surface | `#111113` (charcoal-900) |
| Text primary | `#e8e8ec` (metallic-100) |
| Text muted | `#888896` (metallic-400) |
| Accent | `#f59e0b` (amber-forge) |
| Accent bright | `#fbbf24` (amber-glow) |
| Font | Inter (Google Fonts) |

---

## License

Private. All rights reserved. © 2026 Tvastr.
