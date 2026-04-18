-- family_id auf profiles hinzufügen
alter table public.profiles
  add column if not exists family_id uuid;

-- Index für schnelle Suche nach family_id
create index if not exists profiles_family_id_idx
  on public.profiles(family_id);

-- family_role: Rolle innerhalb der Familie
create type public.family_role as enum ('parent', 'child', 'member');

alter table public.profiles
  add column if not exists family_role family_role not null default 'member';
