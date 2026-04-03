/**
 * Structure Selector
 *
 * Selects structural patterns from the catalog based on genome + context.
 * Uses the same exclusion logic as animation-catalog and font-catalog:
 * 1. Filter out patterns forbidden for this context
 * 2. Pick deterministically from eligible pool using genome hash bytes
 *
 * This is the bridge between genome chromosomes and actual page structure.
 */
import { STRUCTURAL_PATTERN_CATALOG, selectLayoutPattern, selectNavPattern, selectHeroPattern, selectSectionPatterns, } from "./structural-pattern-catalog.js";
/**
 * Select all structural patterns for a page based on genome + context.
 *
 * Each selection uses a different hash byte to ensure variety:
 * - byte 0: layout pattern
 * - byte 1: navigation pattern
 * - byte 2: hero pattern
 * - byte 3+: section patterns
 * - byte 8: footer pattern
 * - byte 9: sidebar pattern
 * - byte 10: CTA pattern
 */
export function selectStructure(genome, context) {
    const hash = genome.dnaHash;
    const b = (index) => {
        const wrappedIndex = index % 32;
        return parseInt(hash.slice(wrappedIndex * 2, wrappedIndex * 2 + 2), 16);
    };
    // Context-aware byte offset: different contexts use different hash bytes
    // This ensures the same genome produces different structures for different page types
    const contextHash = hashCode(context.contentType);
    const byteOffset = (base) => (base + contextHash) % 32;
    const rationale = [];
    const complexity = context.complexity;
    const contentType = context.contentType;
    // 1. Layout pattern (byte 0 + context offset)
    const layout = selectLayoutPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(0)),
    });
    if (layout)
        rationale.push(`Layout: ${layout.name} (${layout.source})`);
    // 2. Navigation pattern (byte 1 + context offset)
    const navigation = selectNavPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(1)),
    });
    if (navigation)
        rationale.push(`Navigation: ${navigation.name} (${navigation.source})`);
    // 3. Hero pattern (byte 2 + context offset)
    const hero = selectHeroPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(2)),
    });
    if (hero)
        rationale.push(`Hero: ${hero.name} (${hero.source})`);
    // 4. Section patterns (bytes 3-7 + context offset)
    const sectionCount = genome.chromosomes.ch33_composition_strategy?.sectionCount ?? 5;
    const sections = selectSectionPatterns({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(3)),
        count: Math.min(sectionCount, 8),
    });
    sections.forEach((s, i) => rationale.push(`Section ${i + 1}: ${s.name} (${s.source})`));
    // 5. Footer pattern (byte 8 + context offset)
    const footerPatterns = STRUCTURAL_PATTERN_CATALOG.filter((p) => p.category === "footer" && !p.forbiddenFor.contexts?.includes(contentType));
    const footer = footerPatterns.length > 0
        ? footerPatterns[b(byteOffset(8)) % footerPatterns.length]
        : null;
    if (footer)
        rationale.push(`Footer: ${footer.name} (${footer.source})`);
    // 6. Sidebar pattern (byte 9 + context offset)
    const sidebarPatterns = STRUCTURAL_PATTERN_CATALOG.filter((p) => p.category === "sidebar" && !p.forbiddenFor.contexts?.includes(contentType));
    const sidebar = sidebarPatterns.length > 0
        ? sidebarPatterns[b(byteOffset(9)) % sidebarPatterns.length]
        : null;
    if (sidebar)
        rationale.push(`Sidebar: ${sidebar.name} (${sidebar.source})`);
    // 7. CTA pattern (byte 10 + context offset)
    const ctaPatterns = STRUCTURAL_PATTERN_CATALOG.filter((p) => p.category === "cta" && !p.forbiddenFor.contexts?.includes(contentType));
    const cta = ctaPatterns.length > 0
        ? ctaPatterns[b(byteOffset(10)) % ctaPatterns.length]
        : null;
    if (cta)
        rationale.push(`CTA: ${cta.name} (${cta.source})`);
    return {
        layout,
        navigation,
        hero,
        sections,
        footer,
        sidebar,
        cta,
        rationale,
    };
}
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash);
}
/**
 * Get all available patterns for a category (for exploration/debugging)
 */
export function getAvailablePatterns(category, context, complexity) {
    return STRUCTURAL_PATTERN_CATALOG.filter(p => {
        if (p.category !== category)
            return false;
        if (p.forbiddenFor.contexts?.includes(context))
            return false;
        if (p.forbiddenFor.complexityAbove !== undefined && complexity > p.forbiddenFor.complexityAbove)
            return false;
        if (p.forbiddenFor.complexityBelow !== undefined && complexity < p.forbiddenFor.complexityBelow)
            return false;
        return true;
    });
}
/**
 * Get pattern diversity stats
 */
export function getPatternStats() {
    const byCategory = {};
    const bySource = {};
    for (const pattern of STRUCTURAL_PATTERN_CATALOG) {
        byCategory[pattern.category] = (byCategory[pattern.category] || 0) + 1;
        bySource[pattern.source] = (bySource[pattern.source] || 0) + 1;
    }
    return {
        totalPatterns: STRUCTURAL_PATTERN_CATALOG.length,
        byCategory,
        bySource,
    };
}
