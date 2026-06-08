create table if not exists public.practice_results (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id text not null,
  exam text not null,
  subject text not null,
  university text,
  year integer not null default 0,
  score integer not null,
  total integer not null,
  percentage integer not null,
  duration_minutes integer not null default 0,
  topic_stats jsonb not null default '[]',
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists practice_results_user_id_idx on public.practice_results (user_id);
create index if not exists practice_results_completed_at_idx on public.practice_results (completed_at desc);

alter table public.practice_results enable row level security;

create policy "Users can view own practice results"
  on public.practice_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own practice results"
  on public.practice_results for insert
  with check (auth.uid() = user_id);
