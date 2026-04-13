/**
 * Typography Treatment Catalog
 *
 * How type is *treated* on the page — beyond font choice. Treatments define
 * the performative layer: how characters reveal themselves, how weight
 * animates, how hierarchy is achieved through size + opacity + position.
 *
 * Catalog entries describe WHAT each treatment is and WHEN it applies.
 * CSS and JS generation live in generators/typography-engine.ts.
 *
 * Core rule: treatments emerge from the genome. A minimalist genome never
 * uses scramble_reveal. A physics:none genome never uses split_char.
 * The forbiddenFor gate is an exclusion list — no whitelists.
 */
export const TYPOGRAPHY_TREATMENT_CATALOG = [
    {
        treatment: "oversized_display",
        description: "Anchor font at clamp(4rem,12vw,14rem) — dominant visual presence.",
        cssClass: "type-oversized",
        forbiddenFor: {},
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "split_char",
        description: "Each character wrapped in .char > .char-inner — enables per-character animation.",
        cssClass: "type-split-char",
        forbiddenFor: {
            requiresPhysicsNot: ["none", "step"],
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "split_word",
        description: "Each word wrapped in .word — enables word-level reveal animations.",
        cssClass: "type-split-word",
        forbiddenFor: {},
        appliesTo: ["display", "h1", "h2"],
    },
    {
        treatment: "kinetic_weight",
        description: "font-variation-settings 'wght' animates on scroll/hover — requires variable font.",
        cssClass: "type-kinetic-weight",
        forbiddenFor: {
            requiresVariableFont: true,
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "scramble_reveal",
        description: "Characters scramble through random glyphs → settle into final text.",
        cssClass: "type-scramble",
        forbiddenFor: {
            requiresPhysicsNot: ["none", "step"],
            philosophies: ["minimalist", "swiss_grid"],
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "stagger_line",
        description: "Lines clip-reveal staggered from overflow:hidden — clean editorial entrance.",
        cssClass: "type-stagger-line",
        forbiddenFor: {},
        appliesTo: ["display", "h1", "h2"],
    },
    {
        treatment: "ghost_text",
        description: "Oversized text at var(--opacity-ghost) as typographic texture/backdrop.",
        cssClass: "type-ghost",
        forbiddenFor: {
            philosophies: ["minimalist", "swiss_grid"],
            minEntropy: 0.30,
        },
        appliesTo: ["display"],
    },
    {
        treatment: "inverted_hierarchy",
        description: "Display headline smaller than body lead — deliberately subverts expectations.",
        cssClass: "type-inverted",
        forbiddenFor: {
            minEntropy: 0.75,
            philosophies: ["minimalist", "swiss_grid", "technical", "brand_heavy"],
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "color_split",
        description: "First half of phrase in var(--color-primary), second in var(--color-accent).",
        cssClass: "type-color-split",
        forbiddenFor: {
            minEntropy: 0.50,
            philosophies: ["minimalist", "swiss_grid"],
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "outline_solid",
        description: "Alternating lines: -webkit-text-stroke outline vs solid fill — per line.",
        cssClass: "type-outline-solid",
        forbiddenFor: {
            minEntropy: 0.55,
            philosophies: ["minimalist"],
        },
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "massive_numeral",
        description: "Stats and counters at clamp(6rem,18vw,22rem) — numbers as hero element.",
        cssClass: "type-massive-numeral",
        forbiddenFor: {},
        appliesTo: ["stat"],
    },
    {
        treatment: "optical_tight",
        description: "letter-spacing: var(--tracking-ultra,-0.04em) on all display — geometric discipline.",
        cssClass: "type-optical-tight",
        forbiddenFor: {},
        appliesTo: ["display", "h1"],
    },
    {
        treatment: "text_wrap_balance",
        description: "text-wrap:balance on headings, text-wrap:pretty on body — browser-native.",
        cssClass: "type-wrap-balance",
        forbiddenFor: {},
        appliesTo: ["display", "h1", "h2", "h3", "body"],
    },
];
// ── Selector ──────────────────────────────────────────────────────────────────
export function getTreatmentEntry(treatment) {
    return TYPOGRAPHY_TREATMENT_CATALOG.find(t => t.treatment === treatment);
}
/**
 * Select the applicable treatments for a genome given its philosophy,
 * entropy, physics, and font variability. Multiple treatments can be active.
 */
export function selectTypographyTreatments(opts) {
    const { philosophy, entropy, physics, isVariableFont } = opts;
    const result = [];
    for (const entry of TYPOGRAPHY_TREATMENT_CATALOG) {
        const f = entry.forbiddenFor;
        // Philosophy gate
        if (f.philosophies?.includes(philosophy))
            continue;
        // Physics exclusion (requiresPhysicsNot: must NOT be one of these)
        if (f.requiresPhysicsNot?.includes(physics))
            continue;
        // Physics inclusion (requiresPhysics: must be one of these)
        if (f.requiresPhysics && !f.requiresPhysics.includes(physics))
            continue;
        // Entropy gate — minEntropy means "only activate when entropy >= this"
        if (f.minEntropy !== undefined && entropy < f.minEntropy)
            continue;
        // Variable font gate — requiresVariableFont:true means font MUST be variable
        // We skip this treatment when the font is NOT variable
        if (f.requiresVariableFont && !isVariableFont)
            continue;
        result.push(entry.treatment);
    }
    return result;
}
