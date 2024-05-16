import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js"; //highlight-line

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      // "@stylistic/js/quotes": ["error", "single"],
      // "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
    },
  },
  { ignores: ["dist", "node_modules"] },
];
