# Tier-Based Entitlement System — Setup Guide

This document outlines the tier-based entitlement system implementation for the Tvastr customer dashboard.

---

## Overview

The system implements 3 license tiers:

| Tier | Access |
|------|--------|
| **ras_core** (Tier 1) | RAS Core only |
| **ras_enterprise** (Tier 2) | RAS Core + RAS Enterprise |
| **full_stack** (Tier 3) | RAS Core + RAS Enterprise + Plant Intelligence |

All UI, routing, and downloads are dynamically controlled by the user's license tier — **no hardcoded logic**.

---

## Implementation Steps

### 1. Run Database Migration

Execute the new migration in your Supabase Dashboard:

1. Go to **Supabase Dashboard → SQL Editor**
2. Open `supabase/migrations/003_tier_entitlement.sql`
3. Run the migration

This will:
- Add `user_id` and `tier` columns to `licenses` table
- Add `required_tier` and `includes_pi` columns to `versions` table
- Create RLS policy for license access
- Update existing version records with tier requirements

### 2. Create Test Users

Create test users in Supabase Auth (Dashboard → Authentication → Users):

**Option A: Manual via Dashboard**
- Click "Add user" → Create with email/password
- Note the `user_id` from the created user

**Option B: Sign up via Portal**
- Go to `/portal` and use the signup flow (if enabled)
- User will be created in auth.users automatically

### 3. Link Users to Licenses

After creating users, link them to licenses in the `licenses` table:

```sql
-- Example: Link user to ras_core tier
insert into licenses (license_key, product_id, customer_name, active, expiry_date, user_id, tier)
values (
  'TVASTR-CORE-001',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- RAS product ID
  'Test User - Core Tier',
  true,
  '2026-12-31',
  '<paste-user-id-here>',
  'ras_core'
);

-- Example: Link user to full_stack tier
insert into licenses (license_key, product_id, customer_name, active, expiry_date, user_id, tier)
values (
  'TVASTR-FULL-001',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901', -- PI product ID
  'Test User - Full Stack',
  true,
  '2026-12-31',
  '<paste-user-id-here>',
  'full_stack'
);
```

**Important**: Each user needs at least one license record with their `user_id`.

### 4. Test the System

Login with different test users and verify:

#### Tier 1 (ras_core):
- ✅ Dashboard shows RAS Core as **ACTIVE**
- ❌ RAS Enterprise shows **LOCKED** (greyed out with upgrade CTA)
- ❌ Plant Intelligence shows **LOCKED**
- ✅ Downloads page shows only RAS versions with `required_tier = 'ras_core'` or below
- ❌ `/portal/pi` route redirects to locked screen

#### Tier 2 (ras_enterprise):
- ✅ Dashboard shows RAS Core + RAS Enterprise as **ACTIVE**
- ❌ Plant Intelligence shows **LOCKED**
- ✅ Downloads page shows RAS Enterprise builds
- ❌ `/portal/pi` route redirects to locked screen

#### Tier 3 (full_stack):
- ✅ All products show as **ACTIVE**
- ✅ Downloads page shows all versions including Plant Intelligence
- ✅ `/portal/pi` route is accessible
- ✅ Navbar shows "Plant Intelligence" link (if logged in)

---

## Architecture

### Frontend Components

**New Files:**
- `src/lib/capabilities.js` — Tier logic and capability mapping
- `src/context/LicenseContext.jsx` — License state management
- `src/components/LockedScreen.jsx` — Full-page locked state
- `src/components/LockedProductCard.jsx` — Locked product card for dashboard

**Modified Files:**
- `src/App.jsx` — Added LicenseProvider, tier-gated routes
- `src/pages/PortalDashboard.jsx` — Tier-driven product cards
- `src/pages/PortalDownloads.jsx` — Filtered downloads by tier
- `src/components/ProductDownloadCard.jsx` — Tier labels on download cards
- `src/components/ProtectedRoute.jsx` — Capability-based route guards
- `src/components/Navbar.jsx` — Conditional nav items

### Database Schema

**licenses table:**
- `user_id` (uuid) — References auth.users(id)
- `tier` (text) — 'ras_core', 'ras_enterprise', or 'full_stack'

**versions table:**
- `required_tier` (text) — Minimum tier required to download
- `includes_pi` (boolean) — Whether version includes Plant Intelligence

### Data Flow

1. User logs in → `AuthContext` provides session
2. `LicenseContext` fetches tier from `licenses` table via `user_id`
3. `getCapabilities(tier)` maps tier to capability flags
4. UI components check capabilities to show/hide/lock features
5. Downloads page filters versions using `isAllowed(version, tier)`

---

## Capability System

All tier logic flows through `src/lib/capabilities.js`:

```javascript
getCapabilities('ras_core')
// → { ras_core: true, ras_enterprise: false, plant_intelligence: false }

getCapabilities('full_stack')
// → { ras_core: true, ras_enterprise: true, plant_intelligence: true }
```

Components use these flags:
```javascript
const { capabilities } = useLicense()

{capabilities?.plant_intelligence ? (
  <ActiveFeature />
) : (
  <LockedFeature />
)}
```

---

## Route Protection

Routes can require specific capabilities:

```jsx
<Route
  path="/portal/pi"
  element={
    <ProtectedRoute requiredCapability="plant_intelligence">
      <PlantIntelligence />
    </ProtectedRoute>
  }
/>
```

If user lacks the capability, they see a `<LockedScreen>` with upgrade CTA.

---

## Customization

### Update Email for Upgrade Requests

Search for `placeholder@email.com` in:
- `src/components/LockedScreen.jsx`
- `src/components/LockedProductCard.jsx`
- `src/pages/PortalDashboard.jsx`

Replace with your actual support/sales email.

### Modify Tier Structure

If you need different tiers:

1. Update `TIER_ORDER` and `TIER_LABELS` in `src/lib/capabilities.js`
2. Update `getCapabilities()` logic
3. Adjust dashboard product definitions in `src/pages/PortalDashboard.jsx`
4. Update version `required_tier` values in database

---

## Troubleshooting

### "No license found for your account"

**Cause**: User doesn't have a license record in `licenses` table with their `user_id`.

**Fix**: Insert a license record linking the user:
```sql
insert into licenses (license_key, product_id, customer_name, active, user_id, tier)
values ('KEY', 'product-uuid', 'Customer Name', true, 'user-uuid', 'ras_core');
```

### Downloads page shows nothing

**Cause**: No versions match the user's tier.

**Fix**: Check `required_tier` on versions. For testing, set some versions to `'ras_core'`:
```sql
update versions set required_tier = 'ras_core' where product_id = 'product-uuid';
```

### Plant Intelligence link doesn't appear in navbar

**Cause**: User tier is not `'full_stack'`.

**Expected behavior** — this is correct. Only full_stack users see this link.

---

## Backend Integration (Optional)

The FastAPI update server can also filter versions by tier server-side.

Modify `tvastr-update-server/app/routes/update_routes.py`:

```python
# After validating license, fetch user's tier from licenses table
tier_response = db.table("licenses") \
    .select("tier") \
    .eq("license_key", license_key) \
    .single() \
    .execute()

user_tier = tier_response.data.get("tier")

# Filter versions by tier before returning
# (implementation left as exercise)
```

This adds server-side enforcement in addition to the frontend filtering.

---

## Security Notes

1. **Frontend filtering is NOT security** — it's UX. Actual access control must happen:
   - In Supabase RLS policies (done)
   - In backend API routes (optional enhancement)
   - In signed URL generation (handled by Supabase Storage)

2. **RLS policies ensure**:
   - Users can only read their own license
   - Signed download URLs expire in 60 seconds
   - Storage bucket is private (not publicly accessible)

3. **License enforcement** happens at download time via signed URLs — even if a user manipulates the frontend, they cannot access files their tier doesn't permit (as long as backend validates tier before generating signed URLs).

---

## Next Steps

1. ✅ Run database migration 003
2. ✅ Create test users in Supabase Auth
3. ✅ Link test users to license records with different tiers
4. ✅ Test all 3 tiers in the portal
5. ✅ Update email addresses for upgrade CTAs
6. ⏭️ (Optional) Add server-side tier filtering in FastAPI
7. ⏭️ (Optional) Add analytics tracking for locked feature views

---

## Support

For questions or issues, refer to:
- Supabase RLS docs: https://supabase.com/docs/guides/auth/row-level-security
- React Context docs: https://react.dev/reference/react/useContext
