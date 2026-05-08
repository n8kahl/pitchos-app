# CLAUDE.md · pitchos-app

@AGENTS.md

This is the **prototype** codebase for **PitchOS** — single-tenant, no auth,
optimized for an end-to-end demo to Scott. The full multi-tenant production
shape is recoverable from git tag `multitenant-snapshot`.

The strategic source of truth lives at:

```
~/Library/CloudStorage/GoogleDrive-kahl.nathan@gmail.com/My Drive/Scott - VC/Startup Toolkit/PitchOS/
```

That folder contains `CLAUDE.md` (project primer), `04_codex_sdd.md` (SDD),
`06_prompt_strategy.md` (7-layer prompt architecture),
`09_anti_patterns_explained.md` (the 16-pattern catalog),
`10_sample_rubric.md` (Scott voice profile + draft rubric v1.2),
`11_content_platform_strategy.md` (rubric defense + Founder Journey Rubric),
`16_content_engine_plan.md` (content engine), and
**`17_unified_rubric.md`** (the canonical research-backed rubric v1.3).

## What this prototype must impress Scott on (priority order)

1. **Memo voice** — signature open, decision close, ≥8 `[slide N]` citations,
   zero banned phrases. Voice regression test in CI.
2. **Visual polish** — SDD §21.1: dark `#070a13` bg · Inter UI / JetBrains
   Mono accents / Source Serif memo prose · signal cyan / amber / red.
3. **Multi-stage progress UI** — visibly proves the chain isn't a single
   LLM call.
4. **Anti-pattern detections with verbatim slide quotes** — closed-catalog
   moat made visible.
5. **End-to-end on a real deck** — drag PDF → memo renders → "this is 70%
   of what I would have written."

## Non-negotiables (preserved despite the lighter shape)

1. Rubric is **partner-specific**, not generic. Scott v1.3 ships seeded.
2. Anti-pattern catalog is **closed** (16 patterns + Scott's 2 custom).
3. Every memo claim **citation-grounded** to a slide quote.
4. Memo passes **voice regression test** on the MeshOps fixture.

## Current phase

Phases 0–1 done · option-2 reshape applied · seeded rubric is v1.3.
Working on Phase 2 (storage + upload) next per `prisma/seed.ts`.

## Stack

Next.js 16 · TS · Tailwind v4 · shadcn/ui · Prisma 7 · PostgreSQL · Zod.

## Conventions

- App Router. No `pages/`.
- Generated Prisma client at `lib/prisma/generated/`. Import `db` from
  `@/lib/db`, never the generated file directly.
- Env: `import { env } from "@/lib/env"`. Never `process.env.X` outside
  `lib/env.ts`.
- AI provider: never call Anthropic/OpenAI directly from a route handler.
  Always go through the provider interface (lands in Phase 3).
- The 16 anti-pattern keys are an **enum** in `lib/ai/anti-patterns.ts`
  (Phase 3). Detections referencing keys outside that enum fail Zod
  validation.
