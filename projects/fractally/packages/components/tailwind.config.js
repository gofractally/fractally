const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const formReset = require("@tailwindcss/forms");

module.exports = {
    purge: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                gray: colors.neutral,
            },
        },
        fontFamily: {
            ...defaultTheme.fontFamily,
            sans: ["Raleway", "sans-serif"],
        },
        screens: {
            xs: "475px",
            ...defaultTheme.screens,
        },
    },
    variants: {
        extend: {
            margin: ["last"],
            backgroundColor: ["active"],
            width: ["focus-within"],
        },
    },
    plugins: [formReset],
};
