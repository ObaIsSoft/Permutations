/**
 * Shader Catalog
 *
 * 12 GLSL shader effects for background planes, image reveals, and
 * page transitions. Each entry describes WHAT the shader does and
 * when it applies. GLSL source is inlined by the WebGL generator.
 *
 * Chromosome drivers map to shaders — not philosophy (shaders are
 * a technical capability, not an aesthetic choice, but they can be
 * suppressed by conservative philosophies).
 */

import { DesignPhilosophy } from "./genome/types.js";

// ── Shader type ───────────────────────────────────────────────────────────────

export type ShaderType =
    | "noise_ripple"
    | "wave_warp"
    | "dissolve_noise"
    | "liquid_warp"
    | "data_flow_lines"
    | "heat_haze"
    | "vhs_dropout"
    | "pixel_sort"
    | "prismatic"
    | "film_grain_gpu"
    | "frosted"
    | "morph_sdf";

// ── Catalog entry ─────────────────────────────────────────────────────────────

export interface ShaderEntry {
    type: ShaderType;
    description: string;
    /** Primary chromosome signals that activate this shader */
    activatedBy: {
        physics?: string[];
        fx?: string[];
        material?: string[];
        sector?: string[];
        minEntropy?: number;
        minHue?: number;
        maxHue?: number;
    };
    forbiddenFor: {
        philosophies?: DesignPhilosophy[];
        maxEntropy?: number;
    };
    /** Whether this shader uses a time uniform (uTime) */
    usesTime: boolean;
    /** Whether this shader uses a progress uniform (uProgress 0→1) */
    usesProgress: boolean;
    /** Whether this shader uses scroll velocity uniform (uVelocity) */
    usesVelocity: boolean;
}

export const SHADER_CATALOG: ShaderEntry[] = [
    {
        type: "noise_ripple",
        description: "Perlin noise UV displacement — organic, flowing ripple.",
        activatedBy: { fx: ["fluid_mesh"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "wave_warp",
        description: "Sine wave distortion, velocity-driven — speed → more warp.",
        activatedBy: { physics: ["wave", "ripple"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "technical"] },
        usesTime: true, usesProgress: false, usesVelocity: true,
    },
    {
        type: "dissolve_noise",
        description: "Noise-threshold dissolve (uProgress 0→1) — for page transitions.",
        activatedBy: {},
        forbiddenFor: {},
        usesTime: false, usesProgress: true, usesVelocity: false,
    },
    {
        type: "liquid_warp",
        description: "Smooth organic UV warping — glass-like distortion.",
        activatedBy: { material: ["glass"] },
        forbiddenFor: { philosophies: ["minimalist", "technical"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "data_flow_lines",
        description: "Vertical streak lines scrolling upward — fintech/data aesthetic.",
        activatedBy: { sector: ["fintech", "saas"] },
        forbiddenFor: { philosophies: ["chaotic", "expressive"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "heat_haze",
        description: "Shimmer/heat distortion — warm colour palettes only.",
        activatedBy: { minHue: 20, maxHue: 60 },
        forbiddenFor: {},
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "vhs_dropout",
        description: "Video noise + horizontal dropout lines — glitch/degraded signal.",
        activatedBy: { physics: ["glitch"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "editorial"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "pixel_sort",
        description: "Pixel sorting along luma threshold — high entropy visual noise.",
        activatedBy: { minEntropy: 0.7 },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid"], maxEntropy: 0.95 },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "prismatic",
        description: "Spectral colour splitting — holographic/iridescent fx.",
        activatedBy: { fx: ["holographic"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "technical"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "film_grain_gpu",
        description: "High-quality grain shader — better than CSS feTurbulence.",
        activatedBy: { minEntropy: 0.3 },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid"] },
        usesTime: true, usesProgress: false, usesVelocity: false,
    },
    {
        type: "frosted",
        description: "Depth-of-field blur shader — frosted glass with real DOF.",
        activatedBy: { material: ["glass"] },
        forbiddenFor: { philosophies: ["minimalist"] },
        usesTime: false, usesProgress: false, usesVelocity: false,
    },
    {
        type: "morph_sdf",
        description: "SDF shape morphing between 2–3 shapes (uProgress 0→1).",
        activatedBy: {},
        forbiddenFor: {},
        usesTime: true, usesProgress: true, usesVelocity: false,
    },
];

// ── Selector ──────────────────────────────────────────────────────────────────

export function getShaderEntry(type: ShaderType): ShaderEntry | undefined {
    return SHADER_CATALOG.find(s => s.type === type);
}

/**
 * Select the best background shader for the genome.
 * Returns null when no shader is appropriate.
 */
export function selectBackgroundShader(opts: {
    philosophy: DesignPhilosophy;
    physics: string;
    fx: string;
    material: string;
    sector: string;
    entropy: number;
    hue: number;
}): ShaderType | null {
    const { philosophy, physics, fx, material, sector, entropy, hue } = opts;

    // Exclusion-first: if minimalist or swiss_grid, most shaders are off
    const conservative = philosophy === "minimalist" || philosophy === "swiss_grid";
    if (conservative && entropy < 0.5) return null;

    // Glitch physics → vhs_dropout
    if (physics === "glitch") return "vhs_dropout";

    // Holographic fx → prismatic
    if (fx === "holographic") return "prismatic";

    // Glass material → liquid_warp or frosted
    if (material === "glass") return "liquid_warp";

    // Fluid mesh fx → noise_ripple
    if (fx === "fluid_mesh") return "noise_ripple";

    // Wave/ripple physics → wave_warp
    if (physics === "wave" || physics === "ripple") return "wave_warp";

    // Warm hue → heat_haze
    if (hue >= 20 && hue <= 60) return "heat_haze";

    // Fintech/saas sector → data_flow_lines
    if (sector === "fintech" || sector === "saas") return "data_flow_lines";

    // High entropy → film_grain_gpu as a base shader
    if (entropy > 0.5) return "film_grain_gpu";

    return null;
}
