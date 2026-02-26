/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                koala: {
                    light: '#F3F6F3',
                    base: '#7D9D78',
                    dark: '#5C7A58',
                    text: '#4A4A4A',
                },
            },
        },
    },
    plugins: [],
}
