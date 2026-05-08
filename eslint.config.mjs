import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pitchos from "./eslint-rules/require-org-scope.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "lib/prisma/generated/**",
  ]),
  {
    plugins: { pitchos },
    rules: {
      "pitchos/require-org-scope": "error",
    },
  },
]);

export default eslintConfig;
