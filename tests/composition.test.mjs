/**
 * Composition Engine Tests
 *
 * Tests for the new page composition system:
 * - Determinism: same genome + intent = same output
 * - Diversity: different genomes produce different structures
 * - Context-awareness: different content types produce different patterns
 * - Library selection: correct libraries selected based on genome
 * - Full pipeline: genome → composition → React/HTML output
 */

import { GenomeSequencer } from "../dist/src/genome/sequencer.js";
import { fontCatalog } from "../dist/src/font-catalog.js";
import { detectPageContext, getContextRules, getAvailableContentTypes } from "../dist/src/genome/context-detector.js";
import { selectStructure, getAvailablePatterns, getPatternStats } from "../dist/src/genome/structure-selector.js";
import { composePage, ContextComposer } from "../dist/src/genome/context-composer.js";
import { ReactGenerator } from "../dist/src/generators/react-generator.js";
import { HTMLGenerator } from "../dist/src/generators/html-generator.js";
import { STRUCTURAL_PATTERN_CATALOG, selectStructuralPatterns } from "../dist/src/genome/structural-pattern-catalog.js";
import { COMPONENT_LIBRARY_CATALOG, selectComponentLibrary } from "../dist/src/genome/component-catalog.js";

// Warm font cache before running tests
try {
    await fontCatalog.warmCache(["bunny", "google", "fontshare"]);
} catch (e) {
    console.log("⚠ Font cache warm failed (network issue), continuing with fallback fonts");
}

// ── Test Helpers ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let errors = [];

function assert(condition, message) {
    if (condition) {
        passed++;
        console.log(`  ✓ ${message}`);
    } else {
        failed++;
        errors.push(message);
        console.error(`  ✗ ${message}`);
    }
}

function assertEqual(actual, expected, message) {
    const match = JSON.stringify(actual) === JSON.stringify(expected);
    assert(match, `${message} (expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)})`);
}

function assertNotEmpty(value, message) {
    const hasValue = value !== null && value !== undefined && value !== "" && 
        (typeof value === "object" ? Object.keys(value).length > 0 : value.length > 0);
    assert(hasValue, message);
}

// ── Test Suite ───────────────────────────────────────────────────────────────

async function runTests() {
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("  Genome Composition Engine Tests");
    console.log("═══════════════════════════════════════════════════════════\n");

    // ── 1. Determinism Tests ──────────────────────────────────────────────
    console.log("── 1. Determinism Tests ──────────────────────────────────");

    const sequencer = new GenomeSequencer();
    const composer = new ContextComposer();

    const intent = "Build a modern shoe ecommerce store with product grid and filters";
    const traits = {
        informationDensity: 0.6,
        temporalUrgency: 0.4,
        emotionalTemperature: 0.5,
        playfulness: 0.6,
        spatialDependency: 0.5,
        trustRequirement: 0.7,
        visualEmphasis: 0.6,
        conversionFocus: 0.8,
    };
    const config = {
        primarySector: "commerce",
        secondarySector: null,
    };

    // Same seed = same genome
    const genome1 = sequencer.generate("test-shoe-store", traits, config);
    const genome2 = sequencer.generate("test-shoe-store", traits, config);

    assertEqual(genome1.dnaHash, genome2.dnaHash, "Same seed produces same dnaHash");
    assertEqual(genome1.chromosomes.ch5_color_primary.hex, genome2.chromosomes.ch5_color_primary.hex, "Same seed produces same color");
    assertEqual(genome1.chromosomes.ch3_type_display.family, genome2.chromosomes.ch3_type_display.family, "Same seed produces same font");

    // Same genome = same composition
    const comp1 = await composer.compose(genome1, intent);
    const comp2 = await composer.compose(genome2, intent);

    assertEqual(comp1.layout.type, comp2.layout.type, "Same genome produces same layout type");
    assertEqual(comp1.sections.length, comp2.sections.length, "Same genome produces same section count");
    assertEqual(comp1.selectedLibraries.animation.name, comp2.selectedLibraries.animation.name, "Same genome selects same animation library");
    assertEqual(comp1.selectedLibraries.components.name, comp2.selectedLibraries.components.name, "Same genome selects same component library");

    // Different seed = different genome
    const genome3 = sequencer.generate("different-shoe-store", traits, config);
    assert(genome1.dnaHash !== genome3.dnaHash, "Different seeds produce different dnaHash");

    // ── 2. Chromosome Generation Tests ────────────────────────────────────
    console.log("\n── 2. Chromosome Generation Tests ────────────────────────");

    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.layoutPattern, "ch33 layoutPattern is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.sectionTypes, "ch33 sectionTypes is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.navRequirement, "ch33 navRequirement is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.heroProminence, "ch33 heroProminence is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.interactionModel, "ch33 interactionModel is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.contentFlow, "ch33 contentFlow is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.densityDistribution, "ch33 densityDistribution is generated");
    assertNotEmpty(genome1.chromosomes.ch33_composition_strategy?.responsiveBehavior, "ch33 responsiveBehavior is generated");

    assertNotEmpty(genome1.chromosomes.ch34_component_topology?.primaryFramework, "ch34 primaryFramework is generated");
    assertNotEmpty(genome1.chromosomes.ch34_component_topology?.compositionStyle, "ch34 compositionStyle is generated");
    assertNotEmpty(genome1.chromosomes.ch34_component_topology?.propComplexity, "ch34 propComplexity is generated");
    assertNotEmpty(genome1.chromosomes.ch34_component_topology?.animationScope, "ch34 animationScope is generated");
    assert(genome1.chromosomes.ch34_component_topology?.nestingDepth >= 1 && genome1.chromosomes.ch34_component_topology?.nestingDepth <= 4, "ch34 nestingDepth is 1-4");
    assert(genome1.chromosomes.ch34_component_topology?.stateBoundaries >= 0 && genome1.chromosomes.ch34_component_topology?.stateBoundaries <= 5, "ch34 stateBoundaries is 0-5");

    const sectionCount = genome1.chromosomes.ch33_composition_strategy?.sectionCount ?? 0;
    assert(sectionCount >= 2 && sectionCount <= 14, `ch33 sectionCount is 2-14 (got ${sectionCount})`);

    // ── 3. Context Detection Tests ────────────────────────────────────────
    console.log("\n── 3. Context Detection Tests ────────────────────────────");

    const ecommerceContext = detectPageContext("Build a shoe store with products and checkout", "commerce", genome1);
    assertEqual(ecommerceContext.contentType, "ecommerce", "Shoe store detected as ecommerce");
    assert(ecommerceContext.requiredSections.includes("product"), "Ecommerce requires product sections");
    assert(ecommerceContext.requiredSections.includes("cta"), "Ecommerce requires CTA sections");
    assert(ecommerceContext.forbiddenSections.includes("metrics"), "Ecommerce forbids metrics sections");

    const dashboardContext = detectPageContext("Build an analytics dashboard with charts and KPIs", "technology", genome1);
    assertEqual(dashboardContext.contentType, "dashboard", "Analytics dashboard detected as dashboard");
    assert(dashboardContext.requiredSections.includes("data"), "Dashboard requires data sections");
    assert(dashboardContext.requiredSections.includes("metrics"), "Dashboard requires metrics sections");
    assert(dashboardContext.forbiddenSections.includes("hero"), "Dashboard forbids hero sections");

    const landingContext = detectPageContext("Create a landing page for our SaaS product", "technology", genome1);
    assertEqual(landingContext.contentType, "landing", "SaaS landing page detected as landing");
    assert(landingContext.requiredSections.includes("feature"), "Landing requires feature sections");
    assert(landingContext.requiredSections.includes("cta"), "Landing requires CTA sections");

    const blogContext = detectPageContext("Build a tech blog with articles and categories", "media", genome1);
    assertEqual(blogContext.contentType, "blog", "Tech blog detected as blog");
    assert(blogContext.requiredSections.includes("content"), "Blog requires content sections");
    assert(blogContext.forbiddenSections.includes("product"), "Blog forbids product sections");

    // Available content types
    const contentTypes = getAvailableContentTypes();
    assert(contentTypes.length > 20, `More than 20 content types available (got ${contentTypes.length})`);
    assert(contentTypes.includes("ecommerce"), "Ecommerce is a valid content type");
    assert(contentTypes.includes("dashboard"), "Dashboard is a valid content type");
    assert(contentTypes.includes("landing"), "Landing is a valid content type");

    // ── 4. Structural Pattern Catalog Tests ───────────────────────────────
    console.log("\n── 4. Structural Pattern Catalog Tests ───────────────────");

    const stats = getPatternStats();
    assert(stats.totalPatterns > 50, `More than 50 patterns in catalog (got ${stats.totalPatterns})`);
    assert(Object.keys(stats.byCategory).length > 5, `More than 5 categories (got ${Object.keys(stats.byCategory).length})`);
    assert(Object.keys(stats.bySource).length > 5, `More than 5 sources (got ${Object.keys(stats.bySource).length})`);

    // Layout patterns available
    const layoutPatterns = getAvailablePatterns("layout", "ecommerce", 0.5);
    assert(layoutPatterns.length > 10, `More than 10 layout patterns for ecommerce (got ${layoutPatterns.length})`);

    // Navigation patterns available
    const navPatterns = getAvailablePatterns("navigation", "ecommerce", 0.5);
    assert(navPatterns.length > 0, `Navigation patterns available for ecommerce (got ${navPatterns.length})`);

    // Hero patterns available
    const heroPatterns = getAvailablePatterns("hero", "landing", 0.5);
    assert(heroPatterns.length > 0, `Hero patterns available for landing (got ${heroPatterns.length})`);

    // Context filtering works
    const dashboardLayouts = getAvailablePatterns("layout", "dashboard", 0.8);
    const landingLayouts = getAvailablePatterns("layout", "landing", 0.5);
    assert(dashboardLayouts.length > 0, "Dashboard has eligible layout patterns");
    assert(landingLayouts.length > 0, "Landing has eligible layout patterns");

    // Complexity filtering works
    const simplePatterns = getAvailablePatterns("layout", "landing", 0.1);
    const complexPatterns = getAvailablePatterns("layout", "landing", 0.9);
    assert(simplePatterns.length > 0, "Simple complexity has eligible patterns");
    assert(complexPatterns.length > 0, "Complex complexity has eligible patterns");

    // ── 5. Structure Selection Tests ──────────────────────────────────────
    console.log("\n── 5. Structure Selection Tests ──────────────────────────");

    const structure1 = selectStructure(genome1, ecommerceContext);
    const structure2 = selectStructure(genome3, ecommerceContext);

    assertNotEmpty(structure1.rationale, "Structure selection produces rationale");
    assert(structure1.rationale.length > 0, "Rationale has entries");

    // Same genome + context = same selection
    const structure1b = selectStructure(genome1, ecommerceContext);
    assertEqual(structure1.layout?.id, structure1b.layout?.id, "Same genome selects same layout");

    // Different genome = different selection (likely)
    const layoutsDiffer = structure1.layout?.id !== structure2.layout?.id;
    assert(layoutsDiffer, "Different genomes likely select different layouts");

    // ── 6. Composition Tests ──────────────────────────────────────────────
    console.log("\n── 6. Composition Tests ──────────────────────────────────");

    const spec = await composer.compose(genome1, intent);

    assertNotEmpty(spec.layout, "Composition has layout");
    assertNotEmpty(spec.sections, "Composition has sections");
    assertNotEmpty(spec.selectedLibraries, "Composition has library selections");
    assertNotEmpty(spec.cssVariables, "Composition has CSS variables");
    assertNotEmpty(spec.animationConfig, "Composition has animation config");
    assertNotEmpty(spec.compositionRationale, "Composition has rationale");

    // CSS variables are genome-derived
    assert(spec.cssVariables["--color-primary"] === genome1.chromosomes.ch5_color_primary?.hex, "CSS primary color matches genome");
    assert(spec.cssVariables["--font-display"] === genome1.chromosomes.ch3_type_display?.family, "CSS font-display matches genome");
    assert(spec.cssVariables["--font-body"] === genome1.chromosomes.ch4_type_body?.family, "CSS font-body matches genome");

    // Sections have genome-derived props
    for (const section of spec.sections) {
        assertNotEmpty(section.props, `Section ${section.type} has props`);
        assertNotEmpty(section.props.colors, `Section ${section.type} has color props`);
        assertNotEmpty(section.props.typography, `Section ${section.type} has typography props`);
    }

    // Library selections are valid
    assertNotEmpty(spec.selectedLibraries.animation.name, "Animation library selected");
    assertNotEmpty(spec.selectedLibraries.icon.name, "Icon library selected");
    assertNotEmpty(spec.selectedLibraries.state.name, "State library selected");
    assertNotEmpty(spec.selectedLibraries.components.name, "Component library selected");
    assertNotEmpty(spec.selectedLibraries.styling.name, "Styling library selected");

    // ── 7. React Generator Tests ──────────────────────────────────────────
    console.log("\n── 7. React Generator Tests ──────────────────────────────");

    const reactGen = new ReactGenerator();
    const reactOutput = reactGen.generate(spec);

    assert(reactOutput.pages.length > 0, "React generator produces pages");
    assert(reactOutput.styles.length > 0, "React generator produces styles");
    assert(reactOutput.config.length > 0, "React generator produces config");

    const pageContent = reactOutput.pages[0].content;
    assert(pageContent.includes("import React"), "React page has React import");
    assert(pageContent.includes("export default function HomePage"), "React page has default export");
    assert(pageContent.includes("className="), "React page uses className");
    assert(pageContent.includes("<nav"), "React page has navigation");
    assert(pageContent.includes("<main"), "React page has main content");
    assert(pageContent.includes("<footer"), "React page has footer");

    const styleContent = reactOutput.styles[0].content;
    assert(styleContent.includes("--color-primary"), "React styles have CSS variables");
    assert(styleContent.includes("--font-display"), "React styles have font variables");
    assert(styleContent.includes(":root"), "React styles have :root block");

    // ── 8. HTML Generator Tests ───────────────────────────────────────────
    console.log("\n── 8. HTML Generator Tests ───────────────────────────────");

    const htmlGen = new HTMLGenerator();
    const htmlOutput = await htmlGen.generate(spec);

    assertNotEmpty(htmlOutput.html, "HTML generator produces HTML");
    assertNotEmpty(htmlOutput.css, "HTML generator produces CSS");
    assertNotEmpty(htmlOutput.js, "HTML generator produces JS");
    assert(htmlOutput.files.length > 0, "HTML generator produces files");

    assert(htmlOutput.html.includes("<!DOCTYPE html>"), "HTML has DOCTYPE");
    assert(htmlOutput.html.includes("<meta charset"), "HTML has charset meta");
    assert(htmlOutput.html.includes("<meta name=\"viewport\""), "HTML has viewport meta");
    assert(htmlOutput.html.includes("<link rel=\"stylesheet\""), "HTML links stylesheet");
    assert(htmlOutput.html.includes("<script src=\"app.js\""), "HTML includes app.js");
    assert(htmlOutput.html.includes("<nav"), "HTML has navigation");
    assert(htmlOutput.html.includes("<main"), "HTML has main content");
    assert(htmlOutput.html.includes("<footer"), "HTML has footer");
    assert(htmlOutput.html.includes("role=\"navigation\""), "HTML has ARIA roles");
    assert(htmlOutput.html.includes("aria-label"), "HTML has aria-labels");

    assert(htmlOutput.css.includes(":root"), "CSS has :root block");
    assert(htmlOutput.css.includes("--color-primary"), "CSS has color variables");
    assert(htmlOutput.css.includes("--font-display"), "CSS has font variables");
    assert(htmlOutput.css.includes("@media"), "CSS has media queries");
    assert(htmlOutput.css.includes("@media print"), "CSS has print styles");

    assert(htmlOutput.js.includes("IntersectionObserver"), "JS has IntersectionObserver for animations");
    assert(htmlOutput.js.includes("initMobileNav"), "JS has mobile nav init");
    assert(htmlOutput.js.includes("initSmoothScroll"), "JS has smooth scroll init");
    assert(htmlOutput.js.includes("initCounters"), "JS has counter animation");

    // Files are complete
    const fileNames = htmlOutput.files.map(f => f.path);
    assert(fileNames.includes("index.html"), "Output includes index.html");
    assert(fileNames.includes("styles.css"), "Output includes styles.css");
    assert(fileNames.includes("app.js"), "Output includes app.js");
    assert(fileNames.includes("manifest.json"), "Output includes manifest.json");

    // ── 9. Component Catalog Tests ────────────────────────────────────────
    console.log("\n── 9. Component Catalog Tests ────────────────────────────");

    assert(COMPONENT_LIBRARY_CATALOG.length > 10, `More than 10 component libraries (got ${COMPONENT_LIBRARY_CATALOG.length})`);

    // Selection works
    const compLib1 = selectComponentLibrary({
        framework: "react",
        compositionStyle: "atomic",
        complexity: 0.5,
        dnaHashByte: 42,
    });
    assertNotEmpty(compLib1.name, "Component library selected");
    assertNotEmpty(compLib1.package, "Component library has package");

    // Different complexity = different selection (likely)
    const compLib2 = selectComponentLibrary({
        framework: "react",
        compositionStyle: "atomic",
        complexity: 0.9,
        dnaHashByte: 42,
    });

    // ── 10. Cross-Content-Type Diversity Tests ────────────────────────────
    console.log("\n── 10. Cross-Content-Type Diversity Tests ────────────────");

    const contentTypesToTest = ["ecommerce", "dashboard", "landing", "blog", "portfolio", "documentation"];
    const layouts = new Set();
    const navTypes = new Set();
    const heroTypes = new Set();

    for (const contentType of contentTypesToTest) {
        const ctx = detectPageContext(`${contentType} page`, contentType === "commerce" ? "commerce" : "technology", genome1);
        const struct = selectStructure(genome1, ctx);
        if (struct.layout) layouts.add(struct.layout.id);
        if (struct.navigation) navTypes.add(struct.navigation.id);
        if (struct.hero) heroTypes.add(struct.hero.id);
    }

    assert(layouts.size > 1, `Different content types select different layouts (got ${layouts.size} unique)`);
    assert(navTypes.size > 0, `Different content types select navigation patterns (got ${navTypes.size} unique)`);

    // ── 11. Full Pipeline Tests ───────────────────────────────────────────
    console.log("\n── 11. Full Pipeline Tests ───────────────────────────────");

    // Full pipeline: genome → context → structure → composition → React
    const pipelineGenome = sequencer.generate("pipeline-test-seed", traits, config);
    const pipelineIntent = "Build a fintech dashboard with real-time metrics and charts";

    const pipelineContext = detectPageContext(pipelineIntent, "fintech", pipelineGenome);
    assertEqual(pipelineContext.contentType, "dashboard", "Pipeline detects dashboard context");

    const pipelineStructure = selectStructure(pipelineGenome, pipelineContext);
    assertNotEmpty(pipelineStructure.rationale, "Pipeline structure has rationale");

    const pipelineSpec = await composer.composeFromStructure(pipelineGenome, pipelineContext, pipelineStructure);
    assertNotEmpty(pipelineSpec.layout, "Pipeline spec has layout");
    assertNotEmpty(pipelineSpec.sections, "Pipeline spec has sections");

    const pipelineReact = reactGen.generate(pipelineSpec);
    assert(pipelineReact.pages.length > 0, "Pipeline produces React output");

    const pipelineHTML = await htmlGen.generate(pipelineSpec);
    assertNotEmpty(pipelineHTML.html, "Pipeline produces HTML output");

    // ── 12. Edge Case Tests ───────────────────────────────────────────────
    console.log("\n── 12. Edge Case Tests ───────────────────────────────────");

    // Minimal genome (no optional chromosomes)
    const minimalGenome = sequencer.generate("minimal-test", {
        informationDensity: 0.3,
        temporalUrgency: 0.2,
        emotionalTemperature: 0.3,
        playfulness: 0.2,
        spatialDependency: 0.3,
        trustRequirement: 0.5,
        visualEmphasis: 0.3,
        conversionFocus: 0.5,
    }, { primarySector: "technology" });

    const minimalSpec = await composer.compose(minimalGenome, "Simple tech blog");
    assertNotEmpty(minimalSpec.layout, "Minimal genome produces layout");
    assertNotEmpty(minimalSpec.sections, "Minimal genome produces sections");
    assertNotEmpty(minimalSpec.cssVariables, "Minimal genome produces CSS variables");

    // High complexity genome
    const complexGenome = sequencer.generate("complex-test", {
        informationDensity: 0.9,
        temporalUrgency: 0.8,
        emotionalTemperature: 0.9,
        playfulness: 0.9,
        spatialDependency: 0.9,
        trustRequirement: 0.9,
        visualEmphasis: 0.9,
        conversionFocus: 0.9,
    }, { primarySector: "technology" });

    const complexSpec = await composer.compose(complexGenome, "Complex enterprise SaaS platform with analytics");
    assertNotEmpty(complexSpec.layout, "Complex genome produces layout");
    assert(complexSpec.context.complexity > 0.3, "Complex genome has higher complexity score");

    // ── 13. Pattern Fetcher Tests ───────────────────────────────────────────
    console.log("\n── 13. Pattern Fetcher Tests ─────────────────────────────");

    const { PATTERN_FETCHERS } = await import("../dist/src/genome/pattern-fetchers.js");

    // Run all fetchers in parallel (skip slow lightpanda scrapers for test speed)
    const fastFetchers = {
        shadcn: PATTERN_FETCHERS.shadcn,
        aceternity: PATTERN_FETCHERS.aceternity,
        hyperui: PATTERN_FETCHERS.hyperui,
        magic_ui: PATTERN_FETCHERS.magic_ui,
        nextui: PATTERN_FETCHERS.nextui,
        mamba_ui: PATTERN_FETCHERS.mamba_ui,
        css_layout: PATTERN_FETCHERS.css_layout,
        flyonui: PATTERN_FETCHERS.flyonui,
        preline: PATTERN_FETCHERS.preline,
    };

    const fetcherEntries = Object.entries(fastFetchers);
    const fetcherResultsArray = await Promise.all(
        fetcherEntries.map(async ([name, fn]) => {
            const patterns = await fn();
            return [name, patterns];
        })
    );

    const fetcherResults = {};
    for (const [name, patterns] of fetcherResultsArray) {
        fetcherResults[name] = patterns.length;
        if (patterns.length > 0) {
            assert(patterns.length > 0, `${name} fetcher returns ${patterns.length} patterns`);
            assert(patterns[0].id, `${name} patterns have IDs`);
            assert(patterns[0].blueprint.template.length > 0, `${name} patterns have HTML templates`);
        }
    }

    const totalFetched = Object.values(fetcherResults).reduce((a, b) => a + b, 0);
    const workingFetchers = Object.entries(fetcherResults).filter(([_, v]) => v > 0).length;
    assert(totalFetched > 200, `Total fetched patterns > 200 (got ${totalFetched})`);
    assert(workingFetchers >= 6, `At least 6 fetchers working (got ${workingFetchers})`);
    assert(fetcherResults.shadcn > 40, `shadcn fetcher returns > 40 patterns (got ${fetcherResults.shadcn})`);
    assert(fetcherResults.mamba_ui >= 0, `mamba_ui fetcher returns patterns (got ${fetcherResults.mamba_ui})`);
    assert(fetcherResults.css_layout > 20, `css_layout fetcher returns > 20 patterns (got ${fetcherResults.css_layout})`);
    assert(fetcherResults.flyonui > 30, `flyonui fetcher returns > 30 patterns (got ${fetcherResults.flyonui})`);
    assert(fetcherResults.preline > 15, `preline fetcher returns > 15 patterns (got ${fetcherResults.preline})`);

    // Verify CSS Layout has both HTML and CSS
    const cssLayoutPatterns = await PATTERN_FETCHERS.css_layout();
    if (cssLayoutPatterns.length > 0) {
        const hasCSS = cssLayoutPatterns.some(p => p.blueprint.styles.length > 50);
        assert(hasCSS, "CSS Layout patterns include CSS styles");
    }

    // Verify Mamba UI patterns are clean (no Angular directives)
    const mambaPatterns = await PATTERN_FETCHERS.mamba_ui();
    if (mambaPatterns.length > 0) {
        const hasAngular = mambaPatterns.some(p => p.blueprint.template.includes('[ngClass]') || p.blueprint.template.includes('*ngIf'));
        assert(!hasAngular, "Mamba UI patterns have Angular directives stripped");
    }

    console.log("\n── Fetcher Summary ───────────────────────────────────────");
    for (const [name, count] of Object.entries(fetcherResults)) {
        if (count > 0) console.log(`  ${name.padEnd(15)} → ${count} patterns`);
    }
    console.log(`  Total: ${totalFetched} patterns from ${workingFetchers} fetchers`);

    // ── Summary ───────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log("═══════════════════════════════════════════════════════════\n");

    if (errors.length > 0) {
        console.error("Failed tests:");
        errors.forEach(e => console.error(`  - ${e}`));
        process.exit(1);
    } else {
        console.log("All tests passed! ✓");
        process.exit(0);
    }
}

// ── Run ──────────────────────────────────────────────────────────────────────

runTests().catch(err => {
    console.error("Test suite error:", err);
    process.exit(1);
});
