create type public.app_role as enum ('guest', 'user', 'admin');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role app_role not null default 'user',
  preferred_locale text not null default 'de',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Jeder kann sein eigenes Profil lesen
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Nutzer können eigenes Profil aktualisieren (außer Rolle)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (role = (select role from public.profiles where id = auth.uid()));

-- Admin kann alle Profile lesen
create policy "Admin can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger: Profil automatisch bei Registrierung anlegen
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
