/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9fe',
                    200: '#c1d2fe',
                    300: '#a2bbfe',
                    400: '#83a4fd',
                    500: '#667eea', // Original primary
                    600: '#5568d3',
                    700: '#4352b9',
                    800: '#323c9e',
                    900: '#1e245a',
                },
                dark: {
                    50: '#f6f6f7',
                    100: '#e1e1e3',
                    200: '#c2c2c7',
                    300: '#a3a3ab',
                    400: '#84848f',
                    500: '#656573',
                    600: '#464657',
                    700: '#27273b',
                    800: '#14142b',
                    900: '#0a0a1a',
                }
            },
            animation: {
                'gradient-x': 'gradient-x 15s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
                    '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
