/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                orodha: {
                    purple: "#6200EA", // Deep Purple for Sidebar
                    pink: "#F50057",   // Pink for Headers/Buttons
                    blue: "#2979FF",   // Blue for Table Headers
                    bg: "#F5F7FA",     // Light Gray Background
                    text: "#374151"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
