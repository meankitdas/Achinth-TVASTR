# Tvastr Supabase Database Schema

This document describes the complete Supabase database schema for the Tvastr customer portal and license management system.

---

## Overview

The Tvastr database consists of:
- **4 core tables**: `products`, `versions`, `licenses`, `download_logs`
- **1 admin function**: `get_all_licenses_with_email()`
- **1 storage bucket**: `updates` (for software distribution)
- **Row Level Security (RLS)** policies for data protection
- **Tier-based access control** (TIER_1, TIER_2, TIER_3)

---

## Tables

### 1. `products`

Stores information about Tvastr products (RAS, Plant Intelligence, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, default: `gen_random_uuid()` | Unique product identifier |
| `name` | `text` | NOT NULL | Product name (e.g., "Rejection Analysis System") |
| `description` | `text` | | Product description |
| `created_at` | `timestamptz` | NOT NULL, default: `now()` | Record creation timestamp |

**Indexes:**
- Primary key on `id`

**RLS Policy:**
- `Authenticated users can read products` — All authenticated users can SELECT

---

### 2. `versions`

Stores software version releases for each product with tier requirements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, default: `gen_random_uuid()` | Unique version identifier |
| `product_id` | `uuid` | NOT NULL, FOREIGN KEY → `products(id)` | Product this version belongs to |
| `version_number` | `text` | NOT NULL | Semantic version (e.g., "1.2.0") |
| `release_date` | `date` | NOT NULL | Version release date |
| `changelog` | `text` | | Release notes |
| `file_path` | `text` | NOT NULL | Path in storage bucket (e.g., "ras/1.2.0.zip") |
| `checksum` | `text` | | SHA-256 checksum for file integrity |
| `required_tier` | `text` | NOT NULL, default: `'ras_core'` | Minimum tier required (legacy: ras_core, ras_enterprise, full_stack) |
| `includes_pi` | `boolean` | NOT NULL, default: `false` | Whether version includes Plant Intelligence |
| `is_stable_rollback` | `boolean` | NOT NULL, default: `false` | Marks exactly one version per product as the permanent stable rollback version |
| `created_at` | `timestamptz` | NOT NULL, default: `now()` | Record creation timestamp |

**Unique Constraint:**
- `(product_id, version_number)` — Prevents duplicate versions for same product

**Indexes:**
- Primary key on `id`
- `idx_versions_product_id` on `product_id`
- `idx_versions_release_date` on `release_date DESC`

**RLS Policy:**
- `Authenticated users can read versions` — All authenticated users can SELECT

**Tier Values:**
- `'ras_core'` → TIER_1 (legacy)
- `'ras_enterprise'` → TIER_2 (legacy)
- `'full_stack'` → TIER_3 (legacy)
- Frontend maps these to `TIER_1`, `TIER_2`, `TIER_3`

---

### 3. `licenses`

Stores customer license information linked to Supabase Auth users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, default: `gen_random_uuid()` | Unique license identifier |
| `license_key` | `text` | NOT NULL, UNIQUE | License key (e.g., "TVASTR-ACHINTH") |
| `product_id` | `uuid` | NOT NULL, FOREIGN KEY → `products(id)` | Licensed product |
| `customer_name` | `text` | NOT NULL | Customer organization name |
| `active` | `boolean` | NOT NULL, default: `true` | License activation status |
| `expiry_date` | `date` | | License expiration (NULL = no expiry) |
| `user_id` | `uuid` | FOREIGN KEY → `auth.users(id)` | Linked Supabase Auth user |
| `tier` | `text` | NOT NULL, default: `'ras_core'` | User's license tier (TIER_1, TIER_2, TIER_3) |
| `created_at` | `timestamptz` | NOT NULL, default: `now()` | Record creation timestamp |

**Indexes:**
- Primary key on `id`
- `idx_licenses_license_key` on `license_key`
- `idx_licenses_product_id` on `product_id`
- `idx_licenses_user_id` on `user_id`

**RLS Policy:**
- `Users can read their own license` — Users can SELECT only where `user_id = auth.uid()`

**Admin Access:**
- Email `achintharya@gmail.com` or license key `TVASTR-ACHINTH` grants admin privileges
- Admin bypass: Frontend checks via `src/lib/admin.js`

---

### 4. `download_logs`

Tracks software downloads for analytics and compliance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, default: `gen_random_uuid()` | Unique log entry identifier |
| `license_key` | `text` | NOT NULL | License used for download |
| `product_id` | `uuid` | NOT NULL | Downloaded product |
| `version_number` | `text` | NOT NULL | Downloaded version |
| `timestamp` | `timestamptz` | NOT NULL, default: `now()` | Download timestamp |
| `ip_address` | `text` | | User IP address (optional) |

**Indexes:**
- Primary key on `id`
- `idx_download_logs_license` on `license_key`
- `idx_download_logs_product` on `product_id`

**RLS Policy:**
- No public policies (service role only)

---

## PostgreSQL Functions

### `get_all_licenses_with_email()`

**Purpose:** Admin function to fetch all customer licenses with email addresses

**Returns:** Table with columns:
- `user_id` (uuid)
- `customer_name` (text)
- `license_key` (text)
- `tier` (text)
- `email` (text)
- `created_at` (timestamptz)

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION get_all_licenses_with_email()
RETURNS TABLE (
  user_id uuid,
  customer_name text,
  license_key text,
  tier text,
  email text,
  created_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.user_id,
    l.customer_name,
    l.license_key,
    l.tier,
    au.email::text,
    l.created_at
  FROM public.licenses l
  LEFT JOIN auth.users au ON l.user_id = au.id
  ORDER BY l.created_at DESC;
END;
$$;
```

**Security:**
- `SECURITY DEFINER` — Runs with function owner privileges (can access `auth.users`)
- Frontend authorization check via `isAdmin` (from `src/lib/admin.js`)
- Granted to `authenticated` role

**Usage:**
```sql
-- From SQL Editor
SELECT * FROM get_all_licenses_with_email();

-- From frontend (via RPC)
const { data } = await supabase.rpc('get_all_licenses_with_email')
```

---

## Storage Buckets

### `updates`

**Purpose:** Stores software update packages (.zip files)

**Configuration:**
- **Public:** `false` (private bucket)
- **RLS:** Enabled

**RLS Policy:**
- `Authenticated users can download update packages` — Authenticated users can SELECT objects in bucket

**File Structure Example:**
```
updates/
├── rejection-analysis-system/
│   ├── 1.0.0.zip
│   ├── 1.1.0.zip
│   └── 1.2.0.zip
└── plant-intelligence/
    ├── 1.0.0.zip
    └── 1.0.2.zip
```

**Upload Access:**
- Service role only (no public INSERT policy)

---

## Tier System

The Tvastr portal uses a three-tier license system:

| Tier | Legacy Name | Access Level | Products |
|------|-------------|--------------|----------|
| **TIER_1** | `ras_core` | Basic | RAS Core |
| **TIER_2** | `ras_enterprise` | Enterprise | RAS Core + RAS Enterprise |
| **TIER_3** | `full_stack` | Full Stack | RAS Core + RAS Enterprise + PIRAS (Plant Intelligence) |

**Tier Hierarchy:**
- TIER_3 includes everything from TIER_2 and TIER_1
- TIER_2 includes everything from TIER_1
- Version access is filtered by `required_tier` column

**Frontend Mapping:**
- `src/lib/capabilities.js` — Maps legacy tier names to new format
- `src/context/LicenseContext.jsx` — Fetches user tier from `licenses.tier`
- `src/pages/PortalDashboard.jsx` — Filters product cards by tier

---

## Admin System

### Admin Identification

**Method 1: Email**
- Email: `achintharya@gmail.com`

**Method 2: License Key**
- License Key: `TVASTR-ACHINTH`

**Implementation:**
- `src/lib/admin.js` — Contains `isAdmin(user, licenseKey)` function
- `src/context/LicenseContext.jsx` — Exposes `isAdmin` flag in context
- `src/components/ProtectedRoute.jsx` — Guards `/portal/admin` route with `adminOnly` prop

### Admin Dashboard Features

**Route:** `/portal/admin`

**Tab 1: Customers**
- Displays all customer licenses with:
  - Customer Name
  - Email (from `auth.users`)
  - License Key
  - Tier
  - Created Date
- Uses `get_all_licenses_with_email()` RPC function

**Tab 2: System Documentation**
- Placeholder for `.md` documentation files
- Will read from `public/docs/` directory

**Navigation:**
- Admin can switch between `/portal/admin` (admin view) and `/portal/dashboard` (customer view)

---

## Row Level Security (RLS)

All tables have RLS enabled for security:

### `products`
✅ Authenticated users can read

### `versions`
✅ Authenticated users can read

### `licenses`
✅ Users can only read their own license (`user_id = auth.uid()`)

### `download_logs`
🔒 No public policies (service role only)

### `storage.objects` (updates bucket)
✅ Authenticated users can read (SELECT)
🔒 Only service role can upload (INSERT)

---

## Database Setup Instructions

### Initial Setup

1. **Enable Extensions**
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

2. **Create Tables**
   - Run the table creation SQL for `products`, `versions`, `licenses`, `download_logs`

3. **Create Indexes**
   - Apply all index definitions for query performance

4. **Enable RLS**
   - Enable RLS on all tables
   - Create RLS policies as documented

5. **Create Storage Bucket**
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('updates', 'updates', false)
   ON CONFLICT (id) DO UPDATE SET public = false;
   ```

6. **Create Admin Function**
   - Run the `get_all_licenses_with_email()` function creation SQL
   - Grant execute to authenticated role

### Adding Users

1. Create user in Supabase Auth Dashboard
2. Insert license record:
   ```sql
   INSERT INTO licenses (
     license_key,
     product_id,
     customer_name,
     active,
     expiry_date,
     user_id,
     tier
   ) VALUES (
     'CUSTOM-LICENSE-KEY',
     '<product-uuid>',
     'Customer Name',
     true,
     '2026-12-31',
     '<user-uuid-from-auth>',
     'TIER_2'  -- or TIER_1, TIER_3
   );
   ```

### Admin User Setup

Ensure `achintharya@gmail.com` user has:
- A user account in `auth.users`
- A license record with `license_key = 'TVASTR-ACHINTH'`
- Any tier (admin privileges override tier restrictions)

---

## Frontend Integration

### Authentication Flow

1. User logs in at `/portal` (PortalLogin.jsx)
2. `AuthContext` validates credentials via Supabase Auth
3. `LicenseContext` fetches user's license from `licenses` table
4. If `isAdmin = true`, redirect to `/portal/admin`
5. Otherwise, redirect to `/portal/dashboard`

### Admin Dashboard

- **Route:** `/portal/admin`
- **Component:** `src/pages/AdminDashboard.jsx`
- **Guard:** `<ProtectedRoute adminOnly>`
- **Data Source:** `supabase.rpc('get_all_licenses_with_email')`

### Customer Dashboard

- **Route:** `/portal/dashboard`
- **Component:** `src/pages/PortalDashboard.jsx`
- **Guard:** `<ProtectedRoute>` (any authenticated user)
- **Features:**
  - Product cards filtered by tier
  - Version downloads with license validation
  - Rollback to older versions
  - Upgrade banners for locked features

---

## Environment Variables

Required in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_UPDATE_SERVER_URL=https://your-update-server.com (optional)
```

---

## Security Notes

1. **License Validation:** Frontend checks tier, backend validates license key for downloads
2. **Admin Function:** Uses `SECURITY DEFINER` to access `auth.users` schema
3. **RLS Policies:** Ensure users can only access their own license data
4. **Storage:** Private bucket prevents unauthorized file access
5. **Admin Check:** Hardcoded in `src/lib/admin.js` (email + license key)

---

## Migration History

- **Initial Schema:** Products, versions, licenses, download_logs tables
- **2026-04-07 (v1.1):** Added `get_all_licenses_with_email()` function for admin dashboard
- **2026-04-08 (v1.2):** Added `is_stable_rollback` column for permanent stable rollback support (downloads handled via update server with S3 bucket parameter)

---

## Maintenance

### Adding New Products

```sql
INSERT INTO products (id, name, description)
VALUES (gen_random_uuid(), 'New Product', 'Description');
```

### Adding New Versions

```sql
INSERT INTO versions (
  product_id,
  version_number,
  release_date,
  changelog,
  file_path,
  required_tier,
  includes_pi
) VALUES (
  '<product-uuid>',
  '2.0.0',
  '2026-05-01',
  'Major update with new features',
  'product-name/2.0.0.zip',
  'TIER_2',
  false
);
```

### Updating License Tier

```sql
UPDATE licenses
SET tier = 'TIER_3'
WHERE user_id = '<user-uuid>';
```

---

**Last Updated:** 2026-04-08  
**Schema Version:** 1.2 (with stable rollback support)
