import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'tw-',
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.vue",
    ],

    darkMode: "class",

    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Prompt",
                    "DM Sans",
                    "Figtree",
                    "Source Code Pro",
                    ...defaultTheme.fontFamily.sans,
                ],
            },
            keyframes: {
                "up-down": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "press": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(0.96)" },
                },
            },
            animation: {
                "up-down": "up-down 3s ease-in-out infinite",
                "slide-up": "slide-up 0.3s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
                "press": "press 0.15s ease-in-out",
            },
            // from oganic
            colors: {
                green: {
                    DEFAULT: "#71B214",
                },
                red: {
                    DEFAULT: "#B71F1F",
                },
                gray: {
                    600: "#606060",
                },
                court: {
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                    950: "#022c22",
                },
                shuttle: {
                    DEFAULT: "#fbbf24",
                    light: "#fcd34d",
                },
            },
            spacing: {
                13: "3.25rem",
                15: "3.75rem",
                26: "6.5rem",
            },
            boxShadow: {
                primary: "0px 9.9px 21.6px rgba(136, 202, 41, 0.41)",
                hsk: "0px 10px 22px rgb(224, 65, 65, 0.4)",
            },
            // from oganic
        },
    },

    plugins: [forms],
};
