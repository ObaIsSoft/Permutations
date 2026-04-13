/**
 * Rhythm Engine
 *
 * Consumes the RhythmPattern from ch12_signature and returns:
 *   1. The data-rhythm attribute value to stamp on each section.
 *   2. Structural HTML elements that must live inside certain sections
 *      for the rhythm pattern to render (e.g. .section-bg-shape for shape_motif).
 *
 * The html-generator calls this per section and injects the results.
 *
 * No CSS is generated here — that lives in rhythm-catalog.ts.
 * No hardcoded colours, sizes, or values.
 */

import type { DesignGenome } from "../genome/types.js";
import type { RhythmPattern } from "../genome/types.js";

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Attributes stamped on every section element for the active rhythm pattern.
 */
export interface SectionRhythmAttrs {
    "data-rhythm": RhythmPattern;
}

/**
 * Return the rhythm attribute for the genome's active pattern.
 */
export function getSectionRhythmAttrs(genome: DesignGenome): SectionRhythmAttrs {
    const pattern = (genome.chromosomes.ch12_signature?.rhythmPattern ?? "color_band") as RhythmPattern;
    return { "data-rhythm": pattern };
}

/**
 * Return any structural HTML element that must be injected as the first
 * child of a section for the given rhythm pattern. Returns an empty string
 * when no structural element is needed.
 *
 * All CSS for these elements is driven by genome vars declared in
 * rhythm-catalog.ts — nothing is hardcoded here.
 */
export function getRhythmMotifElement(pattern: RhythmPattern, indent: string = ""): string {
    switch (pattern) {
        case "shape_motif":
            // Decorative bg shape — CSS positions it absolutely via .section-bg-shape
            return `${indent}<div class="section-bg-shape" aria-hidden="true"></div>\n`;

        case "logo_echo":
            // Ghost logo background — opacity and sizing controlled by CSS vars
            return `${indent}<div class="logo-bg" aria-hidden="true"><svg class="logo-echo-svg" viewBox="0 0 100 100" role="presentation"></svg></div>\n`;

        case "texture_repeat":
            // The grain overlay is added via ::after in CSS — no extra DOM needed
            return "";

        case "color_band":
        case "spacing_scale":
            // data-parity on the section element is enough — no extra element
            return "";

        case "typographic_rule":
            // Section rule lives between sections, not inside them
            return `${indent}<hr class="section-rule" aria-hidden="true">\n`;

        case "image_grid_echo":
        case "icon_system":
        case "gradient_echo":
        case "line_weight":
            // Purely CSS-driven — no extra structural element needed
            return "";

        default:
            return "";
    }
}

/**
 * Return the parity value (odd/even) for a section based on its index.
 * Used for color_band and spacing_scale patterns that alternate via data-parity.
 * (variation-engine also sets data-parity — rhythm-engine re-uses that value.)
 */
export function getSectionParity(sectionIndex: number): "odd" | "even" {
    return sectionIndex % 2 === 0 ? "odd" : "even";
}
