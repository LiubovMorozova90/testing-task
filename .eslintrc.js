module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/prettier",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  overrides: [
    {
      files: ["**/*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "babel-eslint",
      },
    },
  ],
};
