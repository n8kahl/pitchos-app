import { z } from "zod";

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth (dev mode ships first; Clerk lands later)
  AUTH_MODE: z.enum(["dev", "clerk"]).default("dev"),
  DEV_USER_EMAIL: z.string().email().default("nate@example.com"),
  DEV_USER_NAME: z.string().default("Nate (Demo)"),
  DEV_ORG_NAME: z.string().default("Black Dog VP (Demo)"),
  DEV_ORG_KIND: z.enum(["FOUNDER", "FUND", "ACCELERATOR"]).default("FUND"),

  // AI provider — mock is first-class per SDD §2.2
  AI_PROVIDER: z.enum(["mock", "anthropic", "openai"]).default("mock"),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MEMO_MODEL: z.string().default("claude-sonnet-4-6"),
  ANTHROPIC_FAST_MODEL: z.string().default("claude-haiku-4-5-20251001"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_ANALYSIS_MODEL: z.string().optional(),
  OPENAI_FAST_MODEL: z.string().optional(),

  // Strategic versions (pin these — every AnalysisRun is stamped)
  DEFAULT_PARTNER_RUBRIC: z.string().default("black-dog-vp/v1.2"),
  DEFAULT_PARTNER_PROFILE: z.string().default("scott/v1.0"),
  PROMPT_VERSION: z.string().default("v0.2"),

  // Limits
  AI_MAX_DECK_PAGES: z.coerce.number().int().positive().default(40),
  AI_MAX_FILE_MB: z.coerce.number().int().positive().default(25),

  // Storage
  STORAGE_PROVIDER: z.enum(["local", "s3"]).default("local"),
  LOCAL_STORAGE_DIR: z.string().default(".local-storage"),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),

  // Jobs
  ANALYSIS_MODE: z.enum(["inline", "queue"]).default("inline"),
  ANALYSIS_ROUTE_SECRET: z.string().default("dev-secret"),

  // Security
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(900),

  // Phase 9 — out of v1 scope, accept but don't require
  POSTMARK_INBOUND_TOKEN: z.string().optional(),
  VAPI_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(z.treeifyError(parsed.error));
  throw new Error("Environment validation failed. See errors above.");
}

export const env = parsed.data;
export type Env = typeof env;
