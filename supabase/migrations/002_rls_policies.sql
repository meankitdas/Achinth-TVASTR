-- ============================================================
-- Tvastr — Row Level Security Policies Migration 002
-- Run AFTER 001_schema.sql
-- ============================================================

-- Enable RLS on all tables
alter table products       enable row level security;
alter table versions       enable row level security;
alter table licenses       enable row level security;
alter table download_logs  enable row level security;

-- ─── products: authenticated users can read ──────────────────
create policy "Authenticated users can read products"
  on products for select
  to authenticated
  using (true);

-- Service role has full access (implicit — service role bypasses RLS)

-- ─── versions: authenticated users can read ──────────────────
create policy "Authenticated users can read versions"
  on versions for select
  to authenticated
  using (true);

-- ─── licenses: no direct client access (backend only) ────────
-- License validation happens server-side via service role key
-- No policies needed for anon/authenticated — service role bypasses RLS

-- ─── download_logs: service role inserts only ────────────────
-- Logs are written server-side; no client read access
-- No policies for anon/authenticated needed

-- ─── Storage: updates bucket ─────────────────────────────────
-- Run these in Supabase Dashboard → Storage → Policies
-- OR via SQL:

-- Allow authenticated users to read (but not list/write) files
-- These policies apply to the 'updates' storage bucket

insert into storage.buckets (id, name, public)
values ('updates', 'updates', false)
on conflict (id) do update set public = false;

-- Authenticated users can download files (SELECT on objects)
create policy "Authenticated users can download update packages"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'updates');

-- Only service role can upload (INSERT/UPDATE/DELETE)
-- No explicit policy needed — service role bypasses RLS
