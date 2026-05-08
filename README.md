# PitchOS · prototype

Single-tenant local prototype, optimized for the Scott demo. Strategy and
specs in the parent Drive folder. The multi-tenant production shape is
recoverable from `git checkout multitenant-snapshot`.

## Stack

- Next.js 16 · App Router · TypeScript
- Tailwind v4 + shadcn/ui (Base UI primitives)
- Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- Zod for env + AI output schemas
- AI provider interface · mock ships first

## Local setup

```bash
# 1 · install
npm install

# 2 · provision Postgres locally
brew install postgresql@16
brew services start postgresql@16
createdb pitchos
# → DATABASE_URL=postgresql://$(whoami)@localhost:5432/pitchos

# Or Docker:
# docker run -d --name pitchos-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
# → DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

cp .env.example .env
$EDITOR .env

# 3 · migrate + seed
npm run db:migrate
npm run db:seed

# 4 · boot
npm run dev
# → http://localhost:3000
```

## Phase status

| Phase | What | Status |
|---|---|---|
| 0 | Bootstrap | ✓ |
| 1 | Schema + rubric v1.3 seeded | ✓ |
| 2 | Local FS storage + PDF upload | next |
| 3 | Mock provider · 16-pattern catalog · voice regression test | |
| 4 | Orchestrator + multi-stage progress UI | |
| 5 | Polished Report UI · brand palette · Source Serif memo | |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Boot dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run migrations against `DATABASE_URL` |
| `npm run db:seed` | Seed rubric + profile |
| `npm run db:studio` | Open Prisma Studio |
