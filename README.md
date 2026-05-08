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

## Phase status

Phases 0–1 done. Next: Phase 2 (storage + upload).

What works:
- `npm run dev` boots a Tailwind-styled landing page
- `npm run typecheck`, `npm run lint`, `npm run build` all pass
- `lib/env.ts` validates env vars (Zod) on import
- `lib/db.ts` exports a Prisma singleton (pg adapter)
- Full Prisma schema per SDD §12, including `PartnerRubric`, `PartnerProfile`,
  `Outcome`, `PartnerJudgment`, `AntiPatternDetection`, multi-tenant scoping
- `prisma/seed.ts` provisions the BDVP demo org, dev user, Scott rubric v1.2,
  and Scott voice profile v1.0
- `lib/auth.ts` exposes `getCurrentUser()` in dev-auth mode
- `lib/permissions.ts` exposes `assertSameOrg()` and `withOrg()`
- Custom ESLint rule `pitchos/require-org-scope` enforces multi-tenant
  scoping on Prisma queries

Deliberately deferred:
- Storage + upload → Phase 2
- AI schemas + mock provider → Phase 3
- Orchestrator → Phase 4

## Provisioning the database

```bash
# 1 · point DATABASE_URL at a Postgres instance (Neon free tier works)
$EDITOR .env

# 2 · run the initial migration
npm run db:migrate

# 3 · seed the dev org + Scott rubric/profile
npm run db:seed
```

After seeding, the dev user (`DEV_USER_EMAIL`) lands in the seeded
"Black Dog VP (Demo)" workspace with `Scott · Black Dog VP / v1.2`
rubric and `Scott · Black Dog VP / v1.0` voice profile available
system-wide.

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
