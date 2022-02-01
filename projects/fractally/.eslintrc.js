module.exports = {
    extends: ["@nighttrax/eslint-config-tsx", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
        quotes: ["error", "double"],
        "react/react-in-jsx-scope": "off",
        "no-unused-vars": "off",
        "react/jsx-props-no-spreading": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_" },
        ],
    },
};
