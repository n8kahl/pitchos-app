import "server-only";
import type { AuthContext } from "@/lib/auth";

// Runtime guard helpers. The ESLint rule `pitchos/require-org-scope` enforces
// org scoping at lint time; these helpers enforce it at request time on
// boundaries the linter cannot statically prove (e.g. dynamic table access,
// data passed in from clients).

export class OrgScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrgScopeError";
  }
}

export function assertSameOrg(
  ctx: AuthContext,
  resource: { organizationId: string },
  resourceLabel = "resource"
): void {
  if (resource.organizationId !== ctx.organization.id) {
    throw new OrgScopeError(
      `${resourceLabel} belongs to a different organization`
    );
  }
}

export function withOrg<T extends Record<string, unknown>>(
  ctx: AuthContext,
  where: T = {} as T
): T & { organizationId: string } {
  return { ...where, organizationId: ctx.organization.id };
}
