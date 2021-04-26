const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");

module.exports = {
  mode: "jit",
  darkMode: "class",
  purge: {
    content: ["./src/**/*.{html,cjs,js,svelte,ts}"],
    options: {
      defaultExtractor: (content) => [
        ...tailwindExtractor(content),
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
      ],
      keyframes: true,
    },
  },
  theme: {
    extend: {
      colors: {
        creatim: {
          500: "#EE8122",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
