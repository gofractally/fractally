const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const formReset = require("@tailwindcss/forms");

module.exports = {
    purge: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/components/src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                gray: colors.trueGray,
                primary: colors.green,
            },
        },
        fontFamily: {
            ...defaultTheme.fontFamily,
            sans: ["Open Sans", "sans-serif"],
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
