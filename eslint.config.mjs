import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

// This redesign introduces lint coverage for its homepage-only scope.
export default tseslint.config(
  { ignores: [".next/**", "node_modules/**", "test-results/**"] },
  ...tseslint.configs.recommended,
  {
    files: ["app/page.tsx", "components/homepage-*.tsx"],
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
);
