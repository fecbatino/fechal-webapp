-- -------------------------------------------------------
-- family_events: Geteilter Familienkalender
-- -------------------------------------------------------
create table public.family_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  title text not null,
  event_date date not null,
  description text,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.family_events enable row level security;

create policy "Family members can read events"
  on public.family_events for select
  using (
    family_id = (select family_id from public.profiles where id = auth.uid())
  );

create policy "Family members can insert events"
  on public.family_events for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Event creator can delete"
  on public.family_events for delete
  using (created_by = auth.uid());

-- Enable Realtime for live calendar updates
alter publication supabase_realtime add table public.family_events;

-- -------------------------------------------------------
-- family_tasks: Aufgaben & Einkaufslisten
-- -------------------------------------------------------
create table public.family_tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  title text not null,
  completed boolean not null default false,
  category text not null default 'task' check (category in ('task', 'shopping')),
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.family_tasks enable row level security;

create policy "Family members can read tasks"
  on public.family_tasks for select
  using (
    family_id = (select family_id from public.profiles where id = auth.uid())
  );

create policy "Family members can insert tasks"
  on public.family_tasks for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Family members can update tasks"
  on public.family_tasks for update
  using (
    family_id = (select family_id from public.profiles where id = auth.uid())
  );

create policy "Task creator can delete"
  on public.family_tasks for delete
  using (created_by = auth.uid());

-- Enable Realtime
alter publication supabase_realtime add table public.family_tasks;

-- -------------------------------------------------------
-- family_notes: Notizen & Nachrichten
-- -------------------------------------------------------
create table public.family_notes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,
  content text not null,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.family_notes enable row level security;

create policy "Family members can read notes"
  on public.family_notes for select
  using (
    family_id = (select family_id from public.profiles where id = auth.uid())
  );

create policy "Family members can insert notes"
  on public.family_notes for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Note creator can delete"
  on public.family_notes for delete
  using (created_by = auth.uid());

-- Enable Realtime
alter publication supabase_realtime add table public.family_notes;
