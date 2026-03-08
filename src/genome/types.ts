export interface ContentAnalysis {
    visualMarkers: {
        dominantColors: string[];
        colorTemperature: "warm" | "cool" | "neutral";
        textureProfile: "smooth" | "grainy" | "high_contrast";
        imageAspectRatios: ("landscape" | "portrait" | "square")[];
        visualDensity: "sparse" | "medium" | "dense";
    };
    textMarkers: {
        averageWordLength: number;
        textVolume: "minimal" | "medium" | "extensive";
        hierarchyDepth: number;
        contentTone: "technical" | "narrative" | "commercial";
        scanVsReadRatio: number;
    };
    structuralMarkers: {
        contentType: "high_frequency_data" | "long_form" | "portfolio" | "commerce" | "dashboard";
        updateFrequency: "static" | "periodic" | "realtime";
        itemCount: number;
        chronology: boolean;
        taxonomy: boolean;
    };
    epigeneticFactors: {
        existingBrandColors: string[];
        logoTypography: "serif" | "sans" | "script" | "geometric";
        spatialQuality: "organic" | "orthogonal" | "chaotic";
    };
}

export interface ContentTraits {
    informationDensity: number; // 0.0 - 1.0 (sparse to maximal)
    temporalUrgency: number;    // 0.0 - 1.0 (archival to realtime)
    emotionalTemperature: number; // 0.0 - 1.0 (clinical/cold to warm/humanist)
    playfulness: number;        // 0.0 - 1.0 (brutal/strict to organic/whimsical)
    spatialDependency: number;   // 0.0 - 1.0 (flat 2D to deep immersive 3D)
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
        ch13_atmosphere: { fx: "glassmorphism" | "crt_noise" | "fluid_mesh" | "none"; intensity: number };
        ch14_physics: { material: "neumorphism" | "metallic" | "glass" | "matte"; roughness: number; transmission: number };
        ch15_biomarker: { geometry: "monolithic" | "organic" | "fractal"; complexity: number };
    };
    constraints: {
        forbiddenPatterns: string[];
        requiredPatterns: string[];
        bondingRules: string[];
    };
    viabilityScore: number;
}
