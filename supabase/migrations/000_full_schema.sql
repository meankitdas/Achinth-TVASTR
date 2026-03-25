-- ============================================================
-- Tvastr — Full Database Schema (From Scratch)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- 
-- This script creates the complete database schema including:
-- - All tables with tier-based entitlement columns
-- - RLS policies for security
-- - Storage bucket configuration
-- - Indexes for performance
-- - Seed data with tier requirements
-- ============================================================

-- ─── Enable UUID generation ──────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── TABLE: products ─────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ─── TABLE: versions ─────────────────────────────────────────
create table if not exists versions (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  version_number text not null,
  release_date   date not null,
  changelog      text,
  file_path      text not null,   -- path inside 'updates' storage bucket
  checksum       text,            -- sha256 of the zip file
  required_tier  text not null default 'ras_core',  -- minimum tier required
  includes_pi    boolean not null default false,    -- whether version includes Plant Intelligence
  created_at     timestamptz not null default now(),
  unique(product_id, version_number)
);

-- ─── TABLE: licenses ─────────────────────────────────────────
create table if not exists licenses (
  id            uuid primary key default gen_random_uuid(),
  license_key   text not null unique,
  product_id    uuid not null references products(id) on delete cascade,
  customer_name text not null,
  active        boolean not null default true,
  expiry_date   date,
  user_id       uuid references auth.users(id) on delete cascade,  -- links to Supabase Auth
  tier          text not null default 'ras_core',  -- user's license tier
  created_at    timestamptz not null default now()
);

-- ─── TABLE: download_logs ────────────────────────────────────
create table if not exists download_logs (
  id             uuid primary key default gen_random_uuid(),
  license_key    text not null,
  product_id     uuid not null,
  version_number text not null,
  timestamp      timestamptz not null default now(),
  ip_address     text
);

-- ─── Indexes for common queries ──────────────────────────────
create index if not exists idx_versions_product_id      on versions(product_id);
create index if not exists idx_versions_release_date    on versions(release_date desc);
create index if not exists idx_licenses_license_key     on licenses(license_key);
create index if not exists idx_licenses_product_id      on licenses(product_id);
create index if not exists idx_licenses_user_id         on licenses(user_id);
create index if not exists idx_download_logs_license    on download_logs(license_key);
create index if not exists idx_download_logs_product    on download_logs(product_id);

-- ─── Enable RLS on all tables ────────────────────────────────
alter table products       enable row level security;
alter table versions       enable row level security;
alter table licenses       enable row level security;
alter table download_logs  enable row level security;

-- ─── RLS POLICY: products — authenticated users can read ─────
create policy "Authenticated users can read products"
  on products for select
  to authenticated
  using (true);

-- ─── RLS POLICY: versions — authenticated users can read ─────
create policy "Authenticated users can read versions"
  on versions for select
  to authenticated
  using (true);

-- ─── RLS POLICY: licenses — users can read their own license ─
create policy "Users can read their own license"
  on licenses for select
  to authenticated
  using (user_id = auth.uid());

-- Note: download_logs and license validation are service-role only
-- No RLS policies needed for anon/authenticated — backend handles this

-- ─── STORAGE: updates bucket ─────────────────────────────────
insert into storage.buckets (id, name, public)
values ('updates', 'updates', false)
on conflict (id) do update set public = false;

-- Authenticated users can download files (SELECT on objects)
-- Drop existing policy if present (makes script idempotent)
drop policy if exists "Authenticated users can download update packages" on storage.objects;

create policy "Authenticated users can download update packages"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'updates');

-- Only service role can upload (no explicit policy needed — bypasses RLS)

-- ─── SEED DATA ───────────────────────────────────────────────

-- Insert products (deterministic UUIDs for easy reference)
insert into products (id, name, description) values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Rejection Analysis System',
    'An AI-driven casting inspection and defect diagnosis platform that transforms raw inspection images into actionable quality intelligence.'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Plant Intelligence',
    'A factory intelligence layer that reads ERP data, inspection databases, and production logs to answer operational questions and surface actionable insights.'
  )
on conflict (id) do nothing;

-- Insert versions for Rejection Analysis System (ras_enterprise tier)
insert into versions (product_id, version_number, release_date, changelog, file_path, checksum, required_tier, includes_pi) values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.0.0',
    '2024-09-01',
    'Initial release. Core defect detection pipeline, basic reporting.',
    'rejection-analysis-system/1.0.0.zip',
    null,
    'ras_enterprise',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.1.0',
    '2024-11-15',
    'Added root cause analysis module. Improved classification accuracy by 12%.',
    'rejection-analysis-system/1.1.0.zip',
    null,
    'ras_enterprise',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.2.0',
    '2025-01-20',
    'New geometry profiles for automotive castings. Enhanced defect reporting with confidence scores.',
    'rejection-analysis-system/1.2.0.zip',
    null,
    'ras_enterprise',
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.3.0',
    '2025-03-01',
    'Defect classifier accuracy +8%. New geometry profiles. Confidence scoring in reports.',
    'rejection-analysis-system/1.3.0.zip',
    null,
    'ras_enterprise',
    false
  )
on conflict (product_id, version_number) do nothing;

-- Insert versions for Plant Intelligence (full_stack tier)
insert into versions (product_id, version_number, release_date, changelog, file_path, checksum, required_tier, includes_pi) values
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.0.0',
    '2025-01-10',
    'Initial release. NLQ engine v1, ERP connector, SQL adapter.',
    'plant-intelligence/1.0.0.zip',
    null,
    'full_stack',
    true
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.0.2',
    '2025-02-15',
    'Initial stable release. Natural language query engine, ERP connector, RAG knowledge base. Bugfixes for SQL adapter edge cases.',
    'plant-intelligence/1.0.2.zip',
    null,
    'full_stack',
    true
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.1.0',
    '2025-03-10',
    'RAG knowledge base v2. Improved query understanding for Indian manufacturing terminology.',
    'plant-intelligence/1.1.0.zip',
    null,
    'full_stack',
    true
  )
on conflict (product_id, version_number) do nothing;

-- ─── DEMO LICENSES ───────────────────────────────────────────
-- Example license records (link to real user_id after creating auth users)

-- You need to manually link these to auth.users after creating test users
-- Template:
-- insert into licenses (license_key, product_id, customer_name, active, expiry_date, user_id, tier) values
--   (
--     'TVASTR-DEMO-CORE-001',
--     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
--     'Demo User - Core Tier',
--     true,
--     '2026-12-31',
--     '<paste-user-id-from-auth.users>',
--     'ras_core'
--   );

-- Tier options: 'ras_core', 'ras_enterprise', 'full_stack'

-- ============================================================
-- SETUP COMPLETE
-- 
-- Next steps:
-- 1. Create test users in Supabase Auth (Dashboard → Authentication)
-- 2. Link users to licenses with appropriate tiers (see template above)
-- 3. Test the customer portal with different tier levels
-- ============================================================
