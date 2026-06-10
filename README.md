# fechal-webapp

Fechal Batakpales persönliche Webapp — Portfolio, Hajj & Umrah Guides, Alltag & Familie, Arabisch lernen, Koran-Rezitation.

## Tech-Stack

| Komponente | Version |
|---|---|
| Framework | **Next.js 16** (App Router, src-los) |
| Frontend | **React 19**, **Tailwind CSS 4**, **TypeScript 5** |
| i18n | **next-intl 4** (DE / FR / EN) |
| Auth + DB | **Supabase** (SSR, PostgreSQL, Row-Level Security) |
| Unit-Tests | **Jest 30** + **@testing-library/react** |
| E2E-Tests | **Playwright** |

## Seiten

| Route | Sektion | Datenquelle |
|---|---|---|
| `/` | Startseite | Statisch |
| `/portfolio` | Projekte, Skills, CV | Supabase: `portfolio_projects`, `portfolio_skills`, `cv_entries` |
| `/hajj-umrah` | Hajj & Umrah Guides | Statisch: `lib/hajj-data.ts` |
| `/alltag/familie` | Kalender, Aufgaben, Notizen | Supabase: `family_events`, `family_tasks`, `family_notes` |
| `/alltag/arabisch` | Arabisch-Vokabeln (SM-2) | Supabase: `arabic_cards`, `user_card_progress` |
| `/alltag/koran` | Koran-Rezitation | Extern: `api.alquran.cloud/v1` (24h ISR) |
| `/vereine` | Vereins-Übersicht | Statisch |

## Schnellstart

```bash
# 1. Umgebungsvariablen
cp .env.example .env
# NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY eintragen

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungs-Server
npm run dev

# 4. Tests
npm test                    # Unit + Component Tests
npm run test:e2e            # Playwright E2E Tests
npm run test:coverage       # Coverage-Bericht

# 5. Build
npm run build
npm start
```

## Architektur

```
app/[locale]/               ← Locale-basierte Routen (next-intl Middleware)
  ├── portfolio/            ← Server Component + Client Components
  ├── hajj-umrah/           ← Server Component + Client Components
  ├── alltag/familie/       ← FamilyProvider (Context)
  ├── alltag/arabisch/      ← SM-2 Spaced Repetition
  ├── alltag/koran/         ← ISR (24h)
  └── ...
lib/
  ├── hajj-data.ts          ← Statische Hajj/Umrah-Daten + Helpers
  ├── types.ts              ← TypeScript Interfaces (DB-korrespondierend)
  ├── supabase/client.ts    ← Supabase Browser-Client
  ├── supabase/server.ts    ← Supabase SSR-Client (Cookies)
  ├── sm2.ts                ← SM-2 Algorithmus
  └── ...
components/
  ├── hajj/                 ← DuaCollection, HajjStepsGuide, UmrahGuide, PackingChecklist
  ├── portfolio/            ← ProjectCard, ProjectGrid, CvTimeline, SkillTags
  ├── portfolio/admin/      ← ProjectAdmin, SkillAdmin, CvEntryAdmin
  ├── home/                 ← Hero, AboutSection, SectionCards
  ├── alltag/               ← Familie, Arabisch, Koran Componenten
  └── ...
```

## Datenbank

7 Migrationen unter `supabase/migrations/` decken Auth, Profile, Familie, Arabisch-Karten, Koran-Fortschritt und Portfolio ab. Jede Tabelle hat RLS-Policies (SELECT/INSERT/UPDATE/DELETE je nach Rolle und Besitzer).

## Testen

- **Jest:** `__tests__/` — 24 Unit-Tests für Komponenten + Libs
- **Playwright:** `e2e/` — 6 E2E-Tests für kritische User-Flows
- `locale` wird via `useLocale()` von next-intl bezogen — kein Prop-Drilling nötig