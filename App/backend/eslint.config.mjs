import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Ignore compiled output and other non-source directories
    ignores: ["dist/**", "node_modules/**", "scripts/**"],
  },
  {
    rules: {
      // You can add or override rules here. For example:
      // '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  eslintConfigPrettier,
);
