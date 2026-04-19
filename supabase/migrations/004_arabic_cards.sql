-- 004_arabic_cards.sql

create table public.arabic_cards (
  id uuid primary key default gen_random_uuid(),
  arabic text not null,
  transliteration text not null,
  meaning_de text not null,
  meaning_fr text not null,
  meaning_en text not null,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

alter table public.arabic_cards enable row level security;

create policy "Anyone can read arabic cards"
  on public.arabic_cards for select
  using (true);

create table public.user_card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  card_id uuid not null references public.arabic_cards on delete cascade,
  ease_factor numeric not null default 2.5,
  repetitions integer not null default 0,
  interval_days integer not null default 1,
  next_due date not null default current_date,
  updated_at timestamptz not null default now(),
  unique(user_id, card_id)
);

alter table public.user_card_progress enable row level security;

create policy "Users can read own progress"
  on public.user_card_progress for select
  using (user_id = auth.uid());

create policy "Users can insert own progress"
  on public.user_card_progress for insert
  with check (user_id = auth.uid());

create policy "Users can update own progress"
  on public.user_card_progress for update
  using (user_id = auth.uid());
