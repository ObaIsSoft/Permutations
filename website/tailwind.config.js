/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#006466',
                    hue: 181,
                },
                background: '#f5f5f5',
                surface: '#ffffff',
            },
            fontFamily: {
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
                body: ['Inter', 'Roboto', 'sans-serif'],
            },
            spacing: {
                'genome-unit': '16px',
            },
            borderRadius: {
                'genome': '5px',
                'none': '0px',
            },
            transitionTimingFunction: {
                'genome': 'steps(8)',
            },
            transitionDuration: {
                'genome': '743ms',
            },
        },
    },
    plugins: [],
    corePlugins: {
    }
};

/*
Design Genome DNA: 1a6220e0c6030b2c826c80fd119a4db45421cba423dfeac006df24cd920989d4
Viability Score: 1
Bonding Rules Applied:

Forbidden Patterns:

Required Patterns:

*/
