/**
 * Variation Engine
 *
 * Consumes the VariationSequence from ch12_signature and returns the
 * correct data-mode / data-parity / data-index attributes for each
 * section slot. The html-generator calls this per section and injects
 * the resulting attributes into the rendered HTML element.
 *
 * No CSS is generated here — that lives in variation-catalog.ts.
 * No hardcoded colours, sizes, or values.
 */
import { getModeForSection, getSequenceModes } from "../variation-catalog.js";
/**
 * Return the variation attributes for a section at the given index.
 * Reads variationSequence from ch12_signature; falls back to "quiet" mode
 * if the field isn't populated.
 */
export function getSectionVariationAttrs(genome, sectionIndex) {
    const sequence = (genome.chromosomes.ch12_signature?.variationSequence ?? "minimal_voice");
    const mode = getModeForSection(sequence, sectionIndex);
    const parity = sectionIndex % 2 === 0 ? "odd" : "even";
    return {
        "data-mode": mode,
        "data-parity": parity,
        "data-index": String(sectionIndex),
    };
}
/**
 * Serialise an attrs record to an HTML attribute string.
 * e.g. { "data-mode": "quiet", "data-parity": "odd" } → ` data-mode="quiet" data-parity="odd"`
 */
export function attrsToString(attrs) {
    return Object.entries(attrs)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join("");
}
/**
 * Return the ordered section modes for the genome's active sequence.
 * Useful for hero/section planning outside the per-section loop.
 */
export function getSequenceForGenome(genome) {
    const sequence = (genome.chromosomes.ch12_signature?.variationSequence ?? "minimal_voice");
    return getSequenceModes(sequence);
}
