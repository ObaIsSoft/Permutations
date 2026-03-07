/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0a5c12',
                    hue: 126,
                },
                background: '#f5f5f5',
                surface: '#ffffff',
            },
            fontFamily: {
                // DNA dictates Space Grotesk for display (Geometric/Industrial), Inter for body
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
                body: ['Inter', 'Roboto', 'sans-serif'],
            },
            spacing: {
                'genome-unit': '14px', // From rhythm density
            },
            borderRadius: {
                'genome': '0px', // Playfulness 0.05 forced brutalist
                'none': '0px',
            },
            transitionTimingFunction: {
                'genome': 'steps(8)', // From low emotional temp
            },
            transitionDuration: {
                'genome': '200ms',
            },
        },
    },
    plugins: [],
    corePlugins: {
        // No specific core plugin removals required by this specific DNA
    }
};

/*
Design Genome DNA: 3cd02634a22de5029b5359ce0da8003e585a3b45df68559022acf378cb77df77
Viability Score: 1
Bonding Rules Applied:
// - Low Playfulness -> Forced brutalist radius (0px).

Forbidden Patterns:
// - bounce_animations
// - comic_sans
*/
