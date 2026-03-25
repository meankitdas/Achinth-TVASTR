-- ============================================================
-- Tvastr — Tier-Based Entitlement Migration 003
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ─── Add tier columns to licenses table ──────────────────────
alter table licenses
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists tier text not null default 'ras_core';

-- ─── Add tier columns to versions table ──────────────────────
alter table versions
  add column if not exists required_tier text not null default 'ras_core',
  add column if not exists includes_pi boolean not null default false;

-- ─── Index for license lookups by user_id ────────────────────
create index if not exists idx_licenses_user_id on licenses(user_id);

-- ─── RLS Policy: users can read their own license ────────────
create policy "Users can read their own license"
  on licenses for select
  to authenticated
  using (user_id = auth.uid());

-- ─── Update existing data ─────────────────────────────────────
-- Set required_tier for existing versions based on product

-- RAS versions → ras_enterprise tier required (unless we want ras_core for all)
update versions
set required_tier = 'ras_enterprise',
    includes_pi = false
where product_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Plant Intelligence versions → full_stack tier required
update versions
set required_tier = 'full_stack',
    includes_pi = true
where product_id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

-- ─── Demo/Test licenses ──────────────────────────────────────
-- You'll need to manually link existing licenses to auth.users
-- or create new ones. Here's an example template:

-- Example: Create a demo user license (replace with real user_id from auth.users)
-- insert into licenses (license_key, product_id, customer_name, active, expiry_date, user_id, tier) values
--   (
--     'TVASTR-DEMO-CORE-001',
--     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
--     'Demo User - Core Tier',
--     true,
--     '2026-12-31',
--     '<user_id_from_auth_users>',
--     'ras_core'
--   )
-- on conflict (license_key) do nothing;

-- Note: You'll want to create test users in Supabase Auth and link them here
-- Tier options: 'ras_core', 'ras_enterprise', 'full_stack'
