/**
 * Post-processing Catalog
 *
 * 8 composable post-processing passes for WebGL scenes.
 * Passes stack in the order they appear in the selected list.
 * Catalog describes WHAT each pass does. Code generation in webgl-generator.ts.
 */
export const POST_PROCESSING_CATALOG = [
    {
        pass: "bloom_subtle",
        description: "Subtle bloom glow — emissive materials only.",
        effectName: "Bloom",
        activatedBy: { material: ["glass", "holographic", "metallic"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid"] },
    },
    {
        pass: "bloom_aggressive",
        description: "Aggressive bloom — holographic + high entropy.",
        effectName: "Bloom",
        activatedBy: { fx: ["holographic"], minEntropy: 0.7 },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "editorial", "technical"] },
    },
    {
        pass: "film_grain",
        description: "Film grain overlay — intensity scales with noiseLevel.",
        effectName: "Noise",
        activatedBy: { minNoiseLevel: 0.1 },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid"] },
    },
    {
        pass: "vignette",
        description: "Vignette darkening at edges — cinematic framing.",
        effectName: "Vignette",
        activatedBy: { minShadowScale: 0.5 },
        forbiddenFor: {},
    },
    {
        pass: "rgb_shift",
        description: "RGB channel shift — glitch physics only.",
        effectName: "ChromaticAberration",
        activatedBy: { physics: ["glitch"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "editorial"] },
    },
    {
        pass: "scanlines_gpu",
        description: "CRT scanlines — crt_noise fx only.",
        effectName: "Scanline",
        activatedBy: { fx: ["crt_noise"] },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "editorial", "brand_heavy"] },
    },
    {
        pass: "depth_of_field",
        description: "Depth of field blur — glass material.",
        effectName: "DepthOfField",
        activatedBy: { material: ["glass"] },
        forbiddenFor: { philosophies: ["minimalist"] },
    },
    {
        pass: "chromatic_aberration",
        description: "Chromatic aberration — high entropy general.",
        effectName: "ChromaticAberration",
        activatedBy: { minEntropy: 0.65 },
        forbiddenFor: { philosophies: ["minimalist", "swiss_grid", "editorial"] },
    },
];
// ── Selector ──────────────────────────────────────────────────────────────────
/**
 * Select which post-processing passes apply for a given genome context.
 * Returns passes in application order (bloom → grain → vignette → aberration).
 */
export function selectPostProcessingPasses(opts) {
    const { philosophy, material, physics, fx, noiseLevel, shadowScale, entropy } = opts;
    const result = [];
    for (const entry of POST_PROCESSING_CATALOG) {
        const a = entry.activatedBy;
        const f = entry.forbiddenFor;
        // Forbidden check
        if (f.philosophies?.includes(philosophy))
            continue;
        if (f.maxEntropy !== undefined && entropy > f.maxEntropy)
            continue;
        // Activation check — any match is sufficient
        let activated = false;
        if (a.material?.includes(material))
            activated = true;
        if (a.physics?.includes(physics))
            activated = true;
        if (a.fx?.includes(fx))
            activated = true;
        if (a.minNoiseLevel !== undefined && noiseLevel >= a.minNoiseLevel)
            activated = true;
        if (a.minShadowScale !== undefined && shadowScale >= a.minShadowScale)
            activated = true;
        if (a.minEntropy !== undefined && entropy >= a.minEntropy)
            activated = true;
        if (activated)
            result.push(entry.pass);
    }
    // Deduplicate (bloom_subtle + bloom_aggressive both → only aggressive)
    if (result.includes("bloom_aggressive") && result.includes("bloom_subtle")) {
        const idx = result.indexOf("bloom_subtle");
        result.splice(idx, 1);
    }
    // rgb_shift + chromatic_aberration both → only rgb_shift (same effect)
    if (result.includes("rgb_shift") && result.includes("chromatic_aberration")) {
        const idx = result.indexOf("chromatic_aberration");
        result.splice(idx, 1);
    }
    return result;
}
