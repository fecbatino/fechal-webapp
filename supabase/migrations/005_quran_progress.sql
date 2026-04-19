-- 005_quran_progress.sql

create table public.quran_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  surah_number integer not null check (surah_number between 1 and 114),
  status text not null default 'not_started'
    check (status in ('not_started', 'reading', 'memorized')),
  updated_at timestamptz not null default now(),
  unique(user_id, surah_number)
);

alter table public.quran_progress enable row level security;

create policy "Users can read own quran progress"
  on public.quran_progress for select
  using (user_id = auth.uid());

create policy "Users can insert own quran progress"
  on public.quran_progress for insert
  with check (user_id = auth.uid());

create policy "Users can update own quran progress"
  on public.quran_progress for update
  using (user_id = auth.uid());
