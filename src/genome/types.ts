export interface ContentTraits {
    informationDensity: number; // 0.0 - 1.0 (sparse to maximal)
    temporalUrgency: number;    // 0.0 - 1.0 (archival to realtime)
    emotionalTemperature: number; // 0.0 - 1.0 (clinical/cold to warm/humanist)
    playfulness: number;        // 0.0 - 1.0 (brutal/strict to organic/whimsical)
}

export interface DesignGenome {
    dnaHash: string;
    traits: ContentTraits;
    chromosomes: {
        ch1_structure: { topology: "flat" | "deep" | "graph" | "radial"; maxNesting: number };
        ch2_rhythm: { density: "airtight" | "breathing" | "maximal" | "empty"; baseSpacing: number };
        ch3_type_display: { family: string; charge: "geometric" | "humanist" | "monospace" | "transitional"; weight: number };
        ch4_type_body: { family: string; xHeightRatio: number; contrast: number };
        ch5_color_primary: { hue: number; saturation: number; lightness: number; temperature: "warm" | "cool" | "neutral" };
        ch6_color_temp: { backgroundTemp: "warm" | "cool" | "neutral"; contrastRatio: number };
        ch7_edge: { radius: number; style: "sharp" | "soft" | "organic" | "techno" };
        ch8_motion: { physics: "none" | "spring" | "step" | "glitch"; durationScale: number };
        ch9_grid: { logic: "column" | "masonry" | "radial" | "broken"; asymmetry: number };
        ch10_hierarchy: { depth: "flat" | "overlapping" | "3d-stack"; zIndexBehavior: string };
        ch11_texture: { surface: "flat" | "grain" | "glass" | "chrome"; noiseLevel: number };
        ch12_signature: { entropy: number; uniqueMutation: string };
    };
    constraints: {
        forbiddenPatterns: string[];
        requiredPatterns: string[];
        bondingRules: string[];
    };
    viabilityScore: number;
}
