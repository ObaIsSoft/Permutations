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

import * as crypto from "crypto";
import type { DesignGenome } from "./types.js";
import type { PageContext } from "./context-detector.js";
import {
    STRUCTURAL_PATTERN_CATALOG,
    selectStructuralPatterns,
    selectLayoutPattern,
    selectNavPattern,
    selectHeroPattern,
    selectSectionPatterns,
    type StructuralPatternEntry,
    type CatalogContext,
} from "./structural-pattern-catalog.js";

// ── Selection Result ────────────────────────────────────────────────────────

export interface StructureSelection {
    layout: StructuralPatternEntry | null;
    navigation: StructuralPatternEntry | null;
    hero: StructuralPatternEntry | null;
    sections: StructuralPatternEntry[];
    footer: StructuralPatternEntry | null;
    sidebar: StructuralPatternEntry | null;
    cta: StructuralPatternEntry | null;
    rationale: string[];
}

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
export function selectStructure(
    genome: DesignGenome,
    context: PageContext
): StructureSelection {
    const hash = genome.dnaHash;
    const b = (index: number) => {
        const wrappedIndex = index % 32;
        return parseInt(hash.slice(wrappedIndex * 2, wrappedIndex * 2 + 2), 16);
    };

    // Context-aware byte offset: different contexts use different hash bytes
    // This ensures the same genome produces different structures for different page types
    const contextHash = hashCode(context.contentType);
    const byteOffset = (base: number) => (base + contextHash) % 32;

    const rationale: string[] = [];
    const complexity = context.complexity;
    const contentType = context.contentType as CatalogContext;

    // 1. Layout pattern (byte 0 + context offset)
    const layout = selectLayoutPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(0)),
    });
    if (layout) rationale.push(`Layout: ${layout.name} (${layout.source})`);

    // 2. Navigation pattern (byte 1 + context offset)
    const navigation = selectNavPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(1)),
    });
    if (navigation) rationale.push(`Navigation: ${navigation.name} (${navigation.source})`);

    // 3. Hero pattern (byte 2 + context offset)
    const hero = selectHeroPattern({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(2)),
    });
    if (hero) rationale.push(`Hero: ${hero.name} (${hero.source})`);

    // 4. Section patterns (bytes 3-7 + context offset)
    const sectionCount = genome.chromosomes.ch33_composition_strategy?.sectionCount ?? 5;
    const sections = selectSectionPatterns({
        context: contentType,
        complexity,
        dnaHashByte: b(byteOffset(3)),
        count: Math.min(sectionCount, 8),
    });
    sections.forEach((s: StructuralPatternEntry, i: number) => rationale.push(`Section ${i + 1}: ${s.name} (${s.source})`));

    // 5. Footer pattern (byte 8 + context offset)
    const footerPatterns = STRUCTURAL_PATTERN_CATALOG.filter(
        (p: StructuralPatternEntry) => p.category === "footer" && !p.forbiddenFor.contexts?.includes(contentType)
    );
    const footer = footerPatterns.length > 0
        ? footerPatterns[b(byteOffset(8)) % footerPatterns.length]
        : null;
    if (footer) rationale.push(`Footer: ${footer.name} (${footer.source})`);

    // 6. Sidebar pattern (byte 9 + context offset)
    const sidebarPatterns = STRUCTURAL_PATTERN_CATALOG.filter(
        (p: StructuralPatternEntry) => p.category === "sidebar" && !p.forbiddenFor.contexts?.includes(contentType)
    );
    const sidebar = sidebarPatterns.length > 0
        ? sidebarPatterns[b(byteOffset(9)) % sidebarPatterns.length]
        : null;
    if (sidebar) rationale.push(`Sidebar: ${sidebar.name} (${sidebar.source})`);

    // 7. CTA pattern (byte 10 + context offset)
    const ctaPatterns = STRUCTURAL_PATTERN_CATALOG.filter(
        (p: StructuralPatternEntry) => p.category === "cta" && !p.forbiddenFor.contexts?.includes(contentType)
    );
    const cta = ctaPatterns.length > 0
        ? ctaPatterns[b(byteOffset(10)) % ctaPatterns.length]
        : null;
    if (cta) rationale.push(`CTA: ${cta.name} (${cta.source})`);

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

function hashCode(str: string): number {
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
export function getAvailablePatterns(
    category: string,
    context: CatalogContext,
    complexity: number
): StructuralPatternEntry[] {
    return STRUCTURAL_PATTERN_CATALOG.filter(p => {
        if (p.category !== category) return false;
        if (p.forbiddenFor.contexts?.includes(context)) return false;
        if (p.forbiddenFor.complexityAbove !== undefined && complexity > p.forbiddenFor.complexityAbove) return false;
        if (p.forbiddenFor.complexityBelow !== undefined && complexity < p.forbiddenFor.complexityBelow) return false;
        return true;
    });
}

/**
 * Get pattern diversity stats
 */
export function getPatternStats(): {
    totalPatterns: number;
    byCategory: Record<string, number>;
    bySource: Record<string, number>;
} {
    const byCategory: Record<string, number> = {};
    const bySource: Record<string, number> = {};

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
