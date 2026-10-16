import withNuxt from "./.nuxt/eslint.config.mjs";
import vueA11y from "eslint-plugin-vuejs-accessibility";

export default withNuxt(
  {
    name: "app/rule-overrides",
    rules: {
      // Vue 3 supports fragment roots (multiple root nodes per template).
      "vue/no-multiple-template-root": "off",
      "vue/multi-word-component-names": "off",
    },
  },
  // WCAG-oriented static analysis for all .vue templates. CI runs this on
  // every PR (see .github/workflows/pa11y.yml) to prevent a11y regressions.
  ...vueA11y.configs["flat/recommended"],
  {
    name: "app/a11y-tuning",
    files: ["**/*.vue"],
    rules: {
      // Our forms pair <label for="x"> with <input id="x"> (not nesting),
      // which the rule supports — it just requires both by default.
      "vuejs-accessibility/label-has-for": [
        "error",
        { required: { some: ["nesting", "id"] } },
      ],
    },
  },
);
