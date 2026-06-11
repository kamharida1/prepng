-- OTP codes for phone login (Termii sends SMS; Supabase hook not required).

create table if not exists public.phone_otps (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists phone_otps_phone_created_idx
  on public.phone_otps (phone, created_at desc);

alter table public.phone_otps enable row level security;
