-- ============================================================
-- Tvastr — Database Schema Migration 001
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── products ────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ─── versions ────────────────────────────────────────────────
create table if not exists versions (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  version_number text not null,
  release_date   date not null,
  changelog      text,
  file_path      text not null,   -- path inside 'updates' storage bucket
  checksum       text,            -- sha256 of the zip file
  created_at     timestamptz not null default now(),
  unique(product_id, version_number)
);

-- ─── licenses ────────────────────────────────────────────────
create table if not exists licenses (
  id            uuid primary key default gen_random_uuid(),
  license_key   text not null unique,
  product_id    uuid not null references products(id) on delete cascade,
  customer_name text not null,
  active        boolean not null default true,
  expiry_date   date,
  created_at    timestamptz not null default now()
);

-- ─── download_logs ───────────────────────────────────────────
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
create index if not exists idx_download_logs_license    on download_logs(license_key);
create index if not exists idx_download_logs_product    on download_logs(product_id);

-- ─── Seed data ───────────────────────────────────────────────
-- Insert products first (deterministic UUIDs for easy reference)
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

-- Insert versions for Rejection Analysis System
insert into versions (product_id, version_number, release_date, changelog, file_path, checksum) values
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.0.0',
    '2024-09-01',
    'Initial release. Core defect detection pipeline, basic reporting.',
    'rejection-analysis-system/1.0.0.zip',
    null
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.1.0',
    '2024-11-15',
    'Added root cause analysis module. Improved classification accuracy by 12%.',
    'rejection-analysis-system/1.1.0.zip',
    null
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.2.0',
    '2025-01-20',
    'New geometry profiles for automotive castings. Enhanced defect reporting with confidence scores.',
    'rejection-analysis-system/1.2.0.zip',
    null
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1.3.0',
    '2025-03-01',
    'Defect classifier accuracy +8%. New geometry profiles. Confidence scoring in reports.',
    'rejection-analysis-system/1.3.0.zip',
    null
  )
on conflict (product_id, version_number) do nothing;

-- Insert versions for Plant Intelligence
insert into versions (product_id, version_number, release_date, changelog, file_path, checksum) values
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.0.0',
    '2025-01-10',
    'Initial release. NLQ engine v1, ERP connector, SQL adapter.',
    'plant-intelligence/1.0.0.zip',
    null
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.0.2',
    '2025-02-15',
    'Initial stable release. Natural language query engine, ERP connector, RAG knowledge base. Bugfixes for SQL adapter edge cases.',
    'plant-intelligence/1.0.2.zip',
    null
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    '1.1.0',
    '2025-03-10',
    'RAG knowledge base v2. Improved query understanding for Indian manufacturing terminology.',
    'plant-intelligence/1.1.0.zip',
    null
  )
on conflict (product_id, version_number) do nothing;

-- Sample license key (replace with real customer details)
insert into licenses (license_key, product_id, customer_name, active, expiry_date) values
  (
    'TVASTR-RAS-DEMO-001',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Demo Customer',
    true,
    '2026-12-31'
  ),
  (
    'TVASTR-PI-DEMO-001',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'Demo Customer',
    true,
    '2026-12-31'
  )
on conflict (license_key) do nothing;
