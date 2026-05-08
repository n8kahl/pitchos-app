# CLAUDE.md · pitchos-app

@AGENTS.md

This is the production codebase for **PitchOS**. The strategic source of
truth lives in a separate directory at:

```
~/Library/CloudStorage/GoogleDrive-kahl.nathan@gmail.com/My Drive/Scott - VC/Startup Toolkit/PitchOS/
```

That folder contains `CLAUDE.md` (the project primer), `04_codex_sdd.md`
(the SDD), `06_prompt_strategy.md`, `09_anti_patterns_explained.md`, and
`10_sample_rubric.md`. **Read those before making strategic changes.**

## Non-negotiables (do not regress)

1. Partner-rubric-driven scoring — `PartnerRubric` + `PartnerProfile` from
   day one.
2. Closed 16-pattern anti-pattern catalog — verbatim quote required, no
   invented categories.
3. Voice transfer with regression test — every memo passes signature open,
   decision close, ≥8 `[slide N]` citations, zero banned phrases.
4. Multi-tenant from day one — every Prisma query scoped to
   `organizationId`. ESLint rule lands in Phase 1.

## Current phase

Phases 0–1 done. Next: Phase 2 (storage + upload) per SDD §29.

- Full Prisma schema in `prisma/schema.prisma` (SDD §12).
- Seed file at `prisma/seed.ts` writes the BDVP demo org, dev user, and
  the system-shipped Black Dog VP rubric v1.2 + Scott profile v1.0
  (organizationId=null = available to all orgs).
- Dev auth: `getCurrentUser()` in `lib/auth.ts` resolves the seeded
  user/org via `DEV_USER_EMAIL`. Clerk lands later.
- Permission helpers: `lib/permissions.ts` (`assertSameOrg`, `withOrg`).
- Custom ESLint rule `pitchos/require-org-scope` flags Prisma queries on
  `project | deck | analysisRun | outcome | partnerJudgment` that don't
  include `organizationId`. Source: `eslint-rules/require-org-scope.mjs`.
  Opt out per call with
  `// eslint-disable-next-line pitchos/require-org-scope`.

## Stack

Next.js 16 · TS · Tailwind v4 · shadcn/ui · Prisma 7 · PostgreSQL · Zod.

## Conventions

- App Router. No `pages/`.
- Generated Prisma client: `lib/prisma/generated/`. Import `db` from
  `@/lib/db`, not the generated file directly.
- Env access: `import { env } from "@/lib/env"`. Never use
  `process.env.X` outside `lib/env.ts`.
- AI provider: never call Anthropic/OpenAI directly from a route handler.
  Always go through the provider interface (lands in Phase 3).
