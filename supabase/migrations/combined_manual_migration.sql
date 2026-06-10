-- ============================================================
-- COMBINED MANUAL MIGRATION — fechal-webapp
-- Reihenfolge: 001 → 007
-- Im Supabase SQL Editor ausführen (supabase.com/dashboard)
-- ============================================================

-- ============================================================
-- 001: profiles + app_role
-- ============================================================
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

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (role = (select role from public.profiles where id = auth.uid()));

create policy "Admin can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

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
  for each row execute function public.handle_new_user();

-- ============================================================
-- 002: family_id + family_role auf profiles
-- ============================================================
alter table public.profiles
  add column if not exists family_id uuid;

create index if not exists profiles_family_id_idx
  on public.profiles(family_id);

create type public.family_role as enum ('parent', 'child', 'member');

alter table public.profiles
  add column if not exists family_role family_role not null default 'member';

-- ============================================================
-- 003: family_events, family_tasks, family_notes
-- ============================================================
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
  using (family_id = (select family_id from public.profiles where id = auth.uid()));

create policy "Family members can insert events"
  on public.family_events for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Event creator can delete"
  on public.family_events for delete
  using (created_by = auth.uid());

alter publication supabase_realtime add table public.family_events;

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
  using (family_id = (select family_id from public.profiles where id = auth.uid()));

create policy "Family members can insert tasks"
  on public.family_tasks for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Family members can update tasks"
  on public.family_tasks for update
  using (family_id = (select family_id from public.profiles where id = auth.uid()));

create policy "Task creator can delete"
  on public.family_tasks for delete
  using (created_by = auth.uid());

alter publication supabase_realtime add table public.family_tasks;

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
  using (family_id = (select family_id from public.profiles where id = auth.uid()));

create policy "Family members can insert notes"
  on public.family_notes for insert
  with check (
    family_id = (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );

create policy "Note creator can delete"
  on public.family_notes for delete
  using (created_by = auth.uid());

alter publication supabase_realtime add table public.family_notes;

-- ============================================================
-- 004: arabic_cards + user_card_progress
-- ============================================================
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

-- ============================================================
-- 005: quran_progress
-- ============================================================
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

-- ============================================================
-- 006: portfolio_projects, portfolio_skills, cv_entries + Seed
-- ============================================================
CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('web', 'ai', 'vereine')),
  title_de TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  screenshot_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_projects_public_read" ON portfolio_projects
  FOR SELECT USING (true);
CREATE POLICY "portfolio_projects_admin_write" ON portfolio_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TABLE portfolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'ai', 'tools')),
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_skills_public_read" ON portfolio_skills
  FOR SELECT USING (true);
CREATE POLICY "portfolio_skills_admin_write" ON portfolio_skills
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TABLE cv_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('experience', 'education')),
  title_de TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  description_de TEXT,
  description_fr TEXT,
  description_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE cv_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cv_entries_public_read" ON cv_entries
  FOR SELECT USING (true);
CREATE POLICY "cv_entries_admin_write" ON cv_entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

INSERT INTO portfolio_projects (category, title_de, title_fr, title_en, description_de, description_fr, description_en, tech_stack, github_url, live_url, sort_order) VALUES
(
  'web', 'Hizbulazam', 'Hizbulazam', 'Hizbulazam',
  'Tägliche islamische Bittgebete (Duas) als Progressive Web App mit Mehrsprachigkeit, Favoriten-Funktion und anpassbarer Schriftgrösse.',
  'Application web progressive pour les invocations islamiques quotidiennes avec support multilingue, favoris et taille de police ajustable.',
  'Progressive web app for daily Islamic supplications with multilingual support, favorites, and adjustable font size.',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Vite'], 'https://github.com/fechal/hizbulazam', NULL, 1
),
(
  'web', 'Fechal Webapp', 'Fechal Webapp', 'Fechal Webapp',
  'Persönliche Webapp mit Portfolio, Familientools (Kalender, Aufgaben, Notizen), Arabisch-Lernmodul mit Spaced-Repetition und Koran-Leser mit Tajweed-Farben.',
  'Application personnelle avec portfolio, outils famille (calendrier, tâches, notes), module d''apprentissage arabe avec répétition espacée et lecteur de Coran avec couleurs Tajweed.',
  'Personal web app with portfolio, family tools (calendar, tasks, notes), Arabic learning with spaced repetition, and Quran reader with Tajweed colors.',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'next-intl', 'Tailwind CSS'], NULL, NULL, 2
),
(
  'ai', 'KI-Automatisierung', 'Automatisation IA', 'AI Automation',
  'Automatisierungsprojekte mit n8n und der Claude API für wiederkehrende Aufgaben und intelligente Datenverarbeitung.',
  'Projets d''automatisation avec n8n et l''API Claude pour les tâches récurrentes et le traitement intelligent des données.',
  'Automation projects with n8n and Claude API for recurring tasks and intelligent data processing.',
  ARRAY['Claude API', 'n8n', 'TypeScript', 'Python'], NULL, NULL, 3
),
(
  'vereine', 'UMTA Digitalisierung', 'Digitalisation UMTA', 'UMTA Digitalization',
  'Digitalisierungsprojekt für den Verein UMTA – Mitgliederverwaltung, Website und digitale Kommunikation.',
  'Projet de digitalisation pour l''association UMTA – gestion des membres, site web et communication numérique.',
  'Digitalization project for UMTA association – member management, website, and digital communication.',
  ARRAY['WordPress', 'PHP', 'MySQL'], NULL, NULL, 4
);

INSERT INTO portfolio_skills (name, category, sort_order) VALUES
('Next.js', 'frontend', 1), ('React', 'frontend', 2), ('TypeScript', 'frontend', 3),
('Tailwind CSS', 'frontend', 4), ('HTML / CSS', 'frontend', 5),
('Supabase', 'backend', 1), ('PostgreSQL', 'backend', 2), ('Node.js', 'backend', 3), ('Python', 'backend', 4),
('Claude API', 'ai', 1), ('n8n', 'ai', 2), ('OpenAI API', 'ai', 3),
('Git', 'tools', 1), ('GitHub', 'tools', 2), ('Vercel', 'tools', 3), ('VS Code', 'tools', 4), ('Docker', 'tools', 5);

INSERT INTO cv_entries (type, title_de, title_fr, title_en, organization, start_year, end_year, description_de, description_fr, description_en, sort_order) VALUES
('experience', 'Software-Entwickler', 'Développeur logiciel', 'Software Developer', 'Deine Firma AG', 2022, NULL,
  'Full-Stack Entwicklung mit modernen Web-Technologien und KI-Integration.',
  'Développement full-stack avec des technologies web modernes et intégration IA.',
  'Full-stack development with modern web technologies and AI integration.', 1),
('experience', 'Junior Entwickler', 'Développeur Junior', 'Junior Developer', 'Startup GmbH', 2020, 2022, NULL, NULL, NULL, 2),
('education', 'Bachelor Informatik', 'Licence Informatique', 'Bachelor Computer Science', 'Universität Zürich', 2016, 2020, NULL, NULL, NULL, 1),
('education', 'Fachmaturität Informatik', 'Maturité professionnelle informatique', 'Vocational Baccalaureate IT', 'Berufsschule', 2012, 2016, NULL, NULL, NULL, 2);

-- ============================================================
-- 007: Fixes — handle_new_user (mit full_name) + Familie-RPCs + Arabisch-Seed
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

create or replace function public.create_family()
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  new_family_id uuid := gen_random_uuid();
begin
  if exists (select 1 from public.profiles where id = auth.uid() and family_id is not null) then
    raise exception 'already_in_family';
  end if;
  update public.profiles set family_id = new_family_id, family_role = 'parent' where id = auth.uid();
  return new_family_id;
end;
$$;
revoke all on function public.create_family() from public;
grant execute on function public.create_family() to authenticated;

create or replace function public.join_family(target_family_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if exists (select 1 from public.profiles where id = auth.uid() and family_id is not null) then
    raise exception 'already_in_family';
  end if;
  if not exists (select 1 from public.profiles where family_id = target_family_id) then
    raise exception 'family_not_found';
  end if;
  update public.profiles set family_id = target_family_id, family_role = 'member' where id = auth.uid();
end;
$$;
revoke all on function public.join_family(uuid) from public;
grant execute on function public.join_family(uuid) to authenticated;

create or replace function public.leave_family()
returns void language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles set family_id = null, family_role = 'member' where id = auth.uid();
end;
$$;
revoke all on function public.leave_family() from public;
grant execute on function public.leave_family() to authenticated;

insert into public.arabic_cards (arabic, transliteration, meaning_de, meaning_fr, meaning_en, category) values
('اللَّهُ أَكْبَرُ', 'Allahu Akbar', 'Allah ist der Größte', 'Allah est le Plus Grand', 'Allah is the Greatest', 'prayer'),
('الْحَمْدُ لِلَّهِ', 'Alhamdulillah', 'Lob sei Allah', 'Louange à Allah', 'All praise is due to Allah', 'prayer'),
('سُبْحَانَ اللَّهِ', 'Subhanallah', 'Allah sei gepriesen', 'Gloire à Allah', 'Glory be to Allah', 'prayer'),
('لَا إِلَهَ إِلَّا اللَّهُ', 'La ilaha illallah', 'Es gibt keinen Gott außer Allah', 'Il n''y a de dieu qu''Allah', 'There is no god but Allah', 'prayer'),
('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', 'Bismillah ir-Rahman ir-Rahim', 'Im Namen Allahs, des Allerbarmers, des Barmherzigen', 'Au nom d''Allah, le Tout Miséricordieux, le Très Miséricordieux', 'In the name of Allah, the Most Gracious, the Most Merciful', 'prayer'),
('أَسْتَغْفِرُ اللَّهَ', 'Astaghfirullah', 'Ich bitte Allah um Vergebung', 'Je demande le pardon d''Allah', 'I seek forgiveness from Allah', 'prayer'),
('إِنْ شَاءَ اللَّهُ', 'Inshallah', 'So Allah will', 'Si Allah le veut', 'If Allah wills', 'daily'),
('مَاشَاءَ اللَّهُ', 'Mashallah', 'Was Allah gewollt hat', 'Ce qu''Allah a voulu', 'What Allah has willed', 'daily'),
('جَزَاكَ اللَّهُ خَيْرًا', 'Jazakallah Khairan', 'Möge Allah dich belohnen', 'Qu''Allah te récompense', 'May Allah reward you with good', 'daily'),
('السَّلَامُ عَلَيْكُمْ', 'As-salamu alaykum', 'Friede sei mit euch', 'La paix soit sur vous', 'Peace be upon you', 'daily'),
('وَعَلَيْكُمُ السَّلَامُ', 'Wa alaykum as-salam', 'Und Friede sei auch mit euch', 'Et sur vous la paix', 'And peace be upon you too', 'daily'),
('شُكْرًا', 'Shukran', 'Danke', 'Merci', 'Thank you', 'daily'),
('نَعَمْ', 'Naam', 'Ja', 'Oui', 'Yes', 'daily'),
('لَا', 'La', 'Nein', 'Non', 'No', 'daily'),
('مَرْحَبًا', 'Marhaban', 'Willkommen / Hallo', 'Bienvenue / Bonjour', 'Welcome / Hello', 'daily'),
('مَعَ السَّلَامَة', 'Ma''a as-salamah', 'Auf Wiedersehen', 'Au revoir', 'Goodbye', 'daily'),
('الصَّلَاة', 'as-Salah', 'Das Gebet', 'La prière', 'The prayer', 'worship'),
('الْوُضُوء', 'al-Wudu', 'Die rituelle Waschung', 'Les ablutions rituelles', 'Ritual purification', 'worship'),
('الرَّكْعَة', 'ar-Rakah', 'Die Gebetseinheit', 'L''unité de prière', 'Prayer unit (rakah)', 'worship'),
('الْقِبْلَة', 'al-Qibla', 'Gebetsrichtung (Richtung Mekka)', 'Direction de la prière (vers La Mecque)', 'Prayer direction (towards Mecca)', 'worship'),
('السُّجُود', 'as-Sujud', 'Die Niederwerfung', 'La prosternation', 'Prostration', 'worship'),
('الرُّكُوع', 'ar-Ruku', 'Die Verbeugung', 'L''inclinaison', 'Bowing', 'worship'),
('الْقُرْآن', 'al-Quran', 'Der Koran', 'Le Coran', 'The Quran', 'quran'),
('السُّورَة', 'as-Surah', 'Die Korankapitel', 'La sourate', 'The chapter', 'quran'),
('الْآيَة', 'al-Ayah', 'Der Koranvers', 'Le verset', 'The verse', 'quran'),
('الْحِفْظ', 'al-Hifz', 'Das Auswendiglernen', 'La mémorisation', 'Memorization', 'quran'),
('الْحَجّ', 'al-Hajj', 'Die große Pilgerfahrt', 'Le grand pèlerinage', 'The major pilgrimage', 'hajj'),
('الْعُمْرَة', 'al-Umrah', 'Die kleine Pilgerfahrt', 'Le petit pèlerinage', 'The minor pilgrimage', 'hajj'),
('الْإِحْرَام', 'al-Ihram', 'Der Pilgerzustand', 'L''état de sacralisation', 'The state of consecration', 'hajj'),
('الطَّوَاف', 'at-Tawaf', 'Umrundung der Kaaba (7x)', 'Circumambulation de la Kaaba (7x)', 'Circumambulation of the Kaaba (7x)', 'hajj')
on conflict do nothing;

-- ============================================================
-- NACH DER MIGRATION: Admin setzen (deine E-Mail eintragen!)
-- update public.profiles set role = 'admin' where email = 'deine@email.de';
-- ============================================================
