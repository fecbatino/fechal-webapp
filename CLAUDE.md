# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm test             # Jest unit/component tests
npm run test:watch   # Jest watch mode
npm run test:e2e     # Playwright E2E (requires dev server or starts one)
npx jest --testPathPattern=__tests__/hajj/HajjStepsGuide  # Single test file
```

**Env vars required**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Architecture

**Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, Supabase SSR.**

### Routing

All pages live under `app/[locale]/`. Locales: `de` (default), `fr`, `en` — defined in `i18n/routing.ts`. `app/page.tsx` and `app/layout.tsx` are thin shells that redirect to the locale subtree. Never use Next.js `Link` or `redirect` directly — import from `lib/navigation.ts`, which wraps next-intl's locale-aware versions.

### Supabase clients

Two separate clients — pick the right one:
- `lib/supabase/server.ts` — `async createClient()`, cookie-based, for Server Components and Route Handlers
- `lib/supabase/client.ts` — `createClient()`, browser-based, for Client Components

### Sections

| Section | Path | Data source |
|---|---|---|
| Home | `/[locale]` | Static |
| Portfolio | `/[locale]/portfolio` | Supabase tables: `portfolio_projects`, `portfolio_skills`, `cv_entries` |
| Alltag › Familie | `/[locale]/alltag/familie/*` | Supabase: `family_events`, `family_tasks`, `family_notes` |
| Alltag › Arabisch | `/[locale]/alltag/arabisch` | Supabase: `arabic_cards`, `user_card_progress` |
| Alltag › Koran | `/[locale]/alltag/koran` | External: `api.alquran.cloud/v1` (24 h ISR cache) |
| Hajj & Umrah | `/[locale]/hajj-umrah` | Static — `lib/hajj-data.ts` |
| Auth | `/[locale]/auth/*` | Supabase Auth via `/api/auth/callback` route |

### Familie subtree

`app/[locale]/alltag/familie/layout.tsx` wraps children in `FamilyProvider` (from `lib/family-context.tsx`). All familie Client Components call `useFamilyId()` to get the current user's `family_id` before querying Supabase. Server Components call `getFamilyId()` from `lib/family.ts` directly.

### Arabic flashcards (SRS)

`lib/sm2.ts` implements the SM-2 spaced-repetition algorithm. `lib/tajweed.ts` provides tajweed helpers. `UserCardProgress` rows in Supabase track per-user card state.

### Types

All shared types are in `lib/types.ts`. Portfolio types have trilingual fields (`title_de`, `title_fr`, `title_en`).

### Tests

Unit/component tests in `__tests__/`, E2E tests in `e2e/`. Jest uses `jsdom`, path alias `@/` → repo root. Playwright base URL is `localhost:3000`.
