-- Portfolio projects
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

-- Portfolio skills
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

-- CV entries
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

-- ============================================================
-- SEED DATA — customize with your real projects/CV before running
-- ============================================================

INSERT INTO portfolio_projects (category, title_de, title_fr, title_en, description_de, description_fr, description_en, tech_stack, github_url, live_url, sort_order) VALUES
(
  'web',
  'Hizbulazam',
  'Hizbulazam',
  'Hizbulazam',
  'Tägliche islamische Bittgebete (Duas) als Progressive Web App mit Mehrsprachigkeit, Favoriten-Funktion und anpassbarer Schriftgrösse.',
  'Application web progressive pour les invocations islamiques quotidiennes avec support multilingue, favoris et taille de police ajustable.',
  'Progressive web app for daily Islamic supplications with multilingual support, favorites, and adjustable font size.',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  'https://github.com/fechal/hizbulazam',
  NULL,
  1
),
(
  'web',
  'Fechal Webapp',
  'Fechal Webapp',
  'Fechal Webapp',
  'Persönliche Webapp mit Portfolio, Familientools (Kalender, Aufgaben, Notizen), Arabisch-Lernmodul mit Spaced-Repetition und Koran-Leser mit Tajweed-Farben.',
  'Application personnelle avec portfolio, outils famille (calendrier, tâches, notes), module d''apprentissage arabe avec répétition espacée et lecteur de Coran avec couleurs Tajweed.',
  'Personal web app with portfolio, family tools (calendar, tasks, notes), Arabic learning with spaced repetition, and Quran reader with Tajweed colors.',
  ARRAY['Next.js', 'TypeScript', 'Supabase', 'next-intl', 'Tailwind CSS'],
  NULL,
  NULL,
  2
),
(
  'ai',
  'KI-Automatisierung',
  'Automatisation IA',
  'AI Automation',
  'Automatisierungsprojekte mit n8n und der Claude API für wiederkehrende Aufgaben und intelligente Datenverarbeitung.',
  'Projets d''automatisation avec n8n et l''API Claude pour les tâches récurrentes et le traitement intelligent des données.',
  'Automation projects with n8n and Claude API for recurring tasks and intelligent data processing.',
  ARRAY['Claude API', 'n8n', 'TypeScript', 'Python'],
  NULL,
  NULL,
  3
),
(
  'vereine',
  'UMTA Digitalisierung',
  'Digitalisation UMTA',
  'UMTA Digitalization',
  'Digitalisierungsprojekt für den Verein UMTA – Mitgliederverwaltung, Website und digitale Kommunikation.',
  'Projet de digitalisation pour l''association UMTA – gestion des membres, site web et communication numérique.',
  'Digitalization project for UMTA association – member management, website, and digital communication.',
  ARRAY['WordPress', 'PHP', 'MySQL'],
  NULL,
  NULL,
  4
);

INSERT INTO portfolio_skills (name, category, sort_order) VALUES
('Next.js', 'frontend', 1),
('React', 'frontend', 2),
('TypeScript', 'frontend', 3),
('Tailwind CSS', 'frontend', 4),
('HTML / CSS', 'frontend', 5),
('Supabase', 'backend', 1),
('PostgreSQL', 'backend', 2),
('Node.js', 'backend', 3),
('Python', 'backend', 4),
('Claude API', 'ai', 1),
('n8n', 'ai', 2),
('OpenAI API', 'ai', 3),
('Git', 'tools', 1),
('GitHub', 'tools', 2),
('Vercel', 'tools', 3),
('VS Code', 'tools', 4),
('Docker', 'tools', 5);

INSERT INTO cv_entries (type, title_de, title_fr, title_en, organization, start_year, end_year, description_de, description_fr, description_en, sort_order) VALUES
(
  'experience',
  'Software-Entwickler',
  'Développeur logiciel',
  'Software Developer',
  'Deine Firma AG',
  2022,
  NULL,
  'Full-Stack Entwicklung mit modernen Web-Technologien und KI-Integration.',
  'Développement full-stack avec des technologies web modernes et intégration IA.',
  'Full-stack development with modern web technologies and AI integration.',
  1
),
(
  'experience',
  'Junior Entwickler',
  'Développeur Junior',
  'Junior Developer',
  'Startup GmbH',
  2020,
  2022,
  NULL,
  NULL,
  NULL,
  2
),
(
  'education',
  'Bachelor Informatik',
  'Licence Informatique',
  'Bachelor Computer Science',
  'Universität Zürich',
  2016,
  2020,
  NULL,
  NULL,
  NULL,
  1
),
(
  'education',
  'Fachmaturität Informatik',
  'Maturité professionnelle informatique',
  'Vocational Baccalaureate IT',
  'Berufsschule',
  2012,
  2016,
  NULL,
  NULL,
  NULL,
  2
);
