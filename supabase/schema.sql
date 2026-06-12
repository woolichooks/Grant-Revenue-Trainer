-- ============================================================
-- Grant Revenue Trainer — level-time telemetry table.
--
-- Run this once in your Supabase project (Dashboard → SQL Editor → New query
-- → paste → Run). It creates the table that receives each player's solve time
-- per level, and locks it down so the public anon key can INSERT but cannot
-- read anyone's data. Only you (via the dashboard / service role) can read it.
-- ============================================================

create table if not exists public.level_times (
  id           bigint generated always as identity primary key,
  player_name  text        not null,
  level_id     text        not null,
  level_index  int,
  level_label  text,
  mode         text        not null default 'normal',
  score        int         not null check (score between 0 and 7),
  active_ms    bigint      not null check (active_ms >= 0),
  completed_at timestamptz not null default now(),
  inserted_at  timestamptz not null default now()
);

-- Helpful for browsing by player or level.
create index if not exists level_times_player_idx on public.level_times (player_name);
create index if not exists level_times_level_idx  on public.level_times (level_id);

-- Lock the table down: nothing is allowed unless a policy says so.
alter table public.level_times enable row level security;

-- Allow the public app (anon key) and any signed-in user to INSERT only.
drop policy if exists "allow inserts from app" on public.level_times;
create policy "allow inserts from app"
  on public.level_times
  for insert
  to anon, authenticated
  with check (true);

-- NOTE: there are deliberately NO select/update/delete policies, so the anon
-- key cannot read, change, or remove rows. You read the data in the Supabase
-- dashboard (Table editor / SQL editor), which uses the service role and
-- bypasses RLS.
--
-- Example queries for your own analysis:
--   select player_name, level_label, score, active_ms/1000.0 as seconds, completed_at
--   from public.level_times order by completed_at desc;
--
--   select level_label, count(*) players,
--          round(avg(active_ms)/1000.0, 1) as avg_seconds,
--          round(min(active_ms)/1000.0, 1) as fastest_seconds
--   from public.level_times group by level_label order by level_label;
