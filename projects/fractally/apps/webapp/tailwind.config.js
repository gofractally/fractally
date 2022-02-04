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
                primary: colors.green
            },
        },
        fontFamily: {
            ...defaultTheme.fontFamily,
            sans: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol",
                "Noto Color Emoji",
            ],
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
