import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
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
                    "DM Sans",
                    "Prompt",
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
            },
            animation: {
                "up-down": "up-down 3s ease-in-out infinite",
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
