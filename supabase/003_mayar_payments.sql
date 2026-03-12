-- ============================================
-- Lovium: Mayar Payment Tracking
-- Run ini di Supabase Dashboard → SQL Editor
-- ============================================

create table if not exists mayar_payments (
  id uuid primary key default gen_random_uuid(),
  mayar_invoice_id text unique not null,
  user_id uuid references profiles(id) on delete cascade,
  diamonds integer not null,
  amount_idr integer not null,
  status text default 'pending' check (status in ('pending', 'paid', 'expired')),
  created_at timestamptz default now(),
  paid_at timestamptz
);

alter table mayar_payments enable row level security;

-- Hanya service role yang bisa akses (webhook, server-side)
drop policy if exists "No direct access" on mayar_payments;
create policy "No direct access" on mayar_payments using (false);
