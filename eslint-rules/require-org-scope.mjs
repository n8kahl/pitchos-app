// Custom ESLint rule: every Prisma query on an org-scoped model must include
// `organizationId` in its where/data/create clause. Enforces SD-04 from
// SDD §7.6 (multi-tenant isolation) at lint time.
//
// Models excluded:
//   - Organization (no organizationId by definition)
//   - User (auth lookups by email; runtime guard lives in lib/auth.ts)
//   - PartnerRubric / PartnerProfile (organizationId is nullable —
//     system-shipped rubrics/profiles deliberately have null)
//   - Children of AnalysisRun (Report, SlideReview, etc.) — scoped through
//     the parent run; running the rule on them adds friction without value
//
// Opt out on a single line with:
//   // eslint-disable-next-line pitchos/require-org-scope

const ORG_SCOPED_MODELS = new Set([
  "project",
  "deck",
  "analysisRun",
  "outcome",
  "partnerJudgment",
]);

const WHERE_METHODS = new Set([
  "findFirst",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "findFirstOrThrow",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
  "count",
  "aggregate",
  "groupBy",
]);

const CREATE_METHODS = new Set([
  "create",
  "createMany",
  "createManyAndReturn",
]);

const UPSERT_METHODS = new Set(["upsert"]);

function getPropName(prop) {
  if (prop.key.type === "Identifier") return prop.key.name;
  if (prop.key.type === "Literal") return String(prop.key.value);
  return null;
}

function findProperty(objExpr, key) {
  if (!objExpr || objExpr.type !== "ObjectExpression") return null;
  for (const prop of objExpr.properties) {
    if (prop.type !== "Property") continue;
    if (getPropName(prop) === key) return prop.value;
  }
  return null;
}

function hasOrganizationId(expr) {
  if (!expr) return false;
  if (expr.type === "ObjectExpression") {
    return expr.properties.some((p) => {
      if (p.type === "SpreadElement") return false;
      if (p.type !== "Property") return false;
      return getPropName(p) === "organizationId";
    });
  }
  // Spread or non-literal expression — can't verify statically. Allow it;
  // authors should reach for the `withOrg()` helper in lib/permissions.ts
  // for the common case.
  return true;
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prisma queries on org-scoped models must include organizationId",
    },
    schema: [],
    messages: {
      missingOrgScope:
        "Prisma `{{method}}` on org-scoped model `{{model}}` must include `organizationId` in `{{key}}`. Use `withOrg(ctx, ...)` from lib/permissions.ts.",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type !== "MemberExpression") return;
        const methodName = callee.property?.name;
        if (!methodName) return;

        const modelExpr = callee.object;
        if (modelExpr.type !== "MemberExpression") return;
        const modelName = modelExpr.property?.name;
        if (!modelName || !ORG_SCOPED_MODELS.has(modelName)) return;

        const arg0 = node.arguments[0];

        if (WHERE_METHODS.has(methodName)) {
          const where = findProperty(arg0, "where");
          if (!hasOrganizationId(where)) {
            context.report({
              node,
              messageId: "missingOrgScope",
              data: { method: methodName, model: modelName, key: "where" },
            });
          }
        } else if (CREATE_METHODS.has(methodName)) {
          const data = findProperty(arg0, "data");
          if (!hasOrganizationId(data)) {
            context.report({
              node,
              messageId: "missingOrgScope",
              data: { method: methodName, model: modelName, key: "data" },
            });
          }
        } else if (UPSERT_METHODS.has(methodName)) {
          const where = findProperty(arg0, "where");
          const create = findProperty(arg0, "create");
          if (!hasOrganizationId(where) || !hasOrganizationId(create)) {
            context.report({
              node,
              messageId: "missingOrgScope",
              data: {
                method: methodName,
                model: modelName,
                key: "where + create",
              },
            });
          }
        }
      },
    };
  },
};

const plugin = {
  rules: {
    "require-org-scope": rule,
  },
};

export default plugin;
