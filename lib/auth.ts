import "server-only";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { Organization, User } from "@/lib/prisma/generated/client";

// Phase 1 ships dev auth. Clerk lands later (SDD §8 / Phase 9 prep).
// In dev mode, every request resolves to the seeded user/org from env vars.
// In Clerk mode, throw — wiring lands when Clerk is integrated.

export type AuthContext = {
  user: User;
  organization: Organization;
};

let cached: AuthContext | null = null;

async function resolveDevContext(): Promise<AuthContext> {
  if (cached) return cached;

  const user = await db.user.findUnique({
    where: { email: env.DEV_USER_EMAIL },
    include: { organization: true },
  });

  if (!user) {
    throw new Error(
      `Dev user ${env.DEV_USER_EMAIL} not found. Run \`npm run db:seed\` first.`
    );
  }

  cached = { user, organization: user.organization };
  return cached;
}

export async function getCurrentUser(): Promise<AuthContext> {
  if (env.AUTH_MODE === "dev") return resolveDevContext();
  throw new Error(
    `AUTH_MODE=${env.AUTH_MODE} not yet implemented. Set AUTH_MODE=dev for Phase 1.`
  );
}

export async function getCurrentOrganization(): Promise<Organization> {
  return (await getCurrentUser()).organization;
}
