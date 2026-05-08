# PitchOS · production app

The Next.js codebase for PitchOS. Strategy and specs live in the parent
directory at `Scott - VC/Startup Toolkit/PitchOS/` — start with `CLAUDE.md`
and `04_codex_sdd.md` over there before changing anything in here.

## Stack

- Next.js 16 · App Router · TypeScript
- Tailwind v4 + shadcn/ui (Base UI primitives)
- Prisma 7 + PostgreSQL
- Zod for env + AI output schemas
- AI provider interface · mock ships first per SDD §29 Phase 3

## Local setup

```bash
# 1 · install
npm install

# 2 · point DATABASE_URL at a Postgres instance
#    free tier on Neon: https://neon.tech
cp .env.example .env
$EDITOR .env

# 3 · generate the Prisma client (also runs on postinstall)
npm run db:generate

# 4 · boot the dev server
npm run dev
# → http://localhost:3000
```

## Phase 0 status

Bootstrap only. No models, no auth, no orchestrator — those land in
Phases 1–4 per SDD §29.

What works in Phase 0:
- `npm run dev` boots a Tailwind-styled landing page
- `npm run typecheck` passes
- `npm run lint` passes
- `lib/env.ts` validates required env vars (Zod) on import
- `lib/db.ts` exports a Prisma singleton (no models seeded yet)

What's deliberately deferred:
- Full Prisma schema → Phase 1
- Dev auth + org scoping ESLint rule → Phase 1
- Storage + upload → Phase 2
- AI schemas + mock provider → Phase 3
- Orchestrator → Phase 4

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Boot dev server with Turbopack |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run migrations against `DATABASE_URL` |
| `npm run db:studio` | Open Prisma Studio |
