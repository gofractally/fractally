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
                slate: {
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    800: "#1E293B",
                    900: "#0F172A",
                },
                emerald: {
                    500: "#10B981",
                },
                orange: {
                    400: "#FB923C",
                },
                purple: {
                    500: "#A855F7",
                },
                lime: {
                    500: "#84CC16",
                },
                rose: {
                    500: "#F43F5E",
                    600: "#E11D48",
                    700: "#BE123C",
                },
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
