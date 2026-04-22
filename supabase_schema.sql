-- ============================================================
-- SARATHI MVP — Supabase Schema v2
-- Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

-- ── USERS ────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null unique,
  name        text        not null,
  college     text        not null,
  created_at  timestamptz not null default now()
);

-- ── ASSESSMENTS ──────────────────────────────────────────────
-- FIXED: column names now match exactly what the API reads/writes
--   raw_answers       (was: answers_json)     — ordered array of 60 answers
--   ai_analysis_result (was: ai_analysis)     — Gemini JSON output
--   updated_at        (new)                   — needed by submit-assessment update call
create table if not exists public.assessments (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.users(id) on delete cascade,
  raw_answers        jsonb       not null default '[]'::jsonb,
  payment_status     boolean     not null default false,
  ai_analysis_result jsonb       null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz null
);

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_users_email            on public.users(email);
create index if not exists idx_users_created_at       on public.users(created_at desc);
create index if not exists idx_assessments_user_id    on public.assessments(user_id);
create index if not exists idx_assessments_payment    on public.assessments(payment_status);
create index if not exists idx_assessments_created_at on public.assessments(created_at desc);

-- ── COMMENTS ─────────────────────────────────────────────────
comment on table  public.users                        is 'SARATHI student profiles';
comment on table  public.assessments                  is 'SARATHI assessment submissions and AI roadmap results';
comment on column public.assessments.raw_answers      is 'Ordered JSON array of 60 answers, one per question';
comment on column public.assessments.ai_analysis_result is 'Gemini-generated career roadmap JSON';
comment on column public.assessments.updated_at       is 'Set when student re-takes assessment';

-- ── MIGRATION: rename old columns if you already have data ───
-- Only run these if you have an existing assessments table with the OLD column names.
-- Skip if you are setting up fresh.
--
-- alter table public.assessments rename column answers_json to raw_answers;
-- alter table public.assessments rename column ai_analysis  to ai_analysis_result;
-- alter table public.assessments alter column ai_analysis_result drop not null;
-- alter table public.assessments alter column raw_answers set default '[]'::jsonb;
-- alter table public.assessments add column if not exists updated_at timestamptz null;

-- ── RLS ───────────────────────────────────────────────────────
-- Intentionally disabled for MVP — API uses service role key server-side.
-- Enable and add policies before allowing any direct client-side Supabase access.

notify pgrst, 'reload schema';
