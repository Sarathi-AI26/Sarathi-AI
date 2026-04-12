-- Run this in Supabase SQL Editor before testing the assessment flow.
-- This schema is for SARATHI MVP (database only, no auth tables).

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  college text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  answers_json jsonb not null default '{}'::jsonb,
  payment_status boolean not null default false,
  ai_analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_created_at on public.users(created_at desc);
create index if not exists idx_assessments_user_id on public.assessments(user_id);
create index if not exists idx_assessments_payment_status on public.assessments(payment_status);
create index if not exists idx_assessments_created_at on public.assessments(created_at desc);

comment on table public.users is 'SARATHI student profiles';
comment on table public.assessments is 'SARATHI assessment submissions and result payloads';

-- RLS is intentionally left disabled for this MVP because the Next.js API uses the service role key server-side.
-- If you enable RLS later, add explicit policies before switching frontend reads directly to Supabase.
