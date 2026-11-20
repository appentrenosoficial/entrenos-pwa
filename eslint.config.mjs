import tseslint from "typescript-eslint";
import nextVitals from "eslint-config-next/core-web-vitals";
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.expo/**",
      "**/dist/**",
      "**/android/**",
      "**/ios/**",
      "**/next-env.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  ...nextVitals.map((config) => ({
    ...config,
    files: ["apps/admin/**/*.{ts,tsx,js,mjs}"],
  })),
  {
    files: ["apps/admin/**/*.{ts,tsx,js,mjs}"],
    settings: { next: { rootDir: "apps/admin/" } },
  },
];
