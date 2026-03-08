/**
 * Permutations Genome Tests
 * Run with: node tests/genome.test.mjs
 */

import { GenomeSequencer } from "../dist/genome/sequencer.js";
import { PatternDetector } from "../dist/constraints/pattern-detector.js";

// Test utilities
function assert(condition, message) {
    if (!condition) {
        throw new Error(`❌ FAIL: ${message}`);
    }
    console.log(`✅ PASS: ${message}`);
}

function assertEqual(a, b, message) {
    assert(a === b, `${message} (expected ${b}, got ${a})`);
}

// Run tests
console.log("🧬 Running Permutations Genome Tests\n");

// Test 1: Determinism
console.log("Test 1: Determinism (Same seed = Same genome)");
{
    const seq = new GenomeSequencer();
    const traits = {
        informationDensity: 0.5,
        temporalUrgency: 0.5,
        emotionalTemperature: 0.5,
        playfulness: 0.5,
        spatialDependency: 0.5
    };
    
    const g1 = seq.generate("test-seed-determinism", traits);
    const g2 = seq.generate("test-seed-determinism", traits);
    
    assertEqual(g1.dnaHash, g2.dnaHash, "Same seed produces same hash");
    assertEqual(g1.chromosomes.ch5_color_primary.hue, g2.chromosomes.ch5_color_primary.hue, "Same seed produces same hue");
}

// Test 2: Uniqueness
console.log("\nTest 2: Uniqueness (Different seeds = Different genomes)");
{
    const seq = new GenomeSequencer();
    const traits = {
        informationDensity: 0.5,
        temporalUrgency: 0.5,
        emotionalTemperature: 0.5,
        playfulness: 0.5,
        spatialDependency: 0.5
    };
    
    const genomes = [];
    for (let i = 0; i < 10; i++) {
        genomes.push(seq.generate(`unique-seed-${i}`, traits));
    }
    
    const hashes = genomes.map(g => g.dnaHash);
    const uniqueHashes = new Set(hashes);
    
    assert(uniqueHashes.size === 10, "10 different seeds produce 10 unique hashes");
}

// Test 3: Archetype Constraints
console.log("\nTest 3: Archetype Constraints");
{
    const seq = new GenomeSequencer();
    
    // Dashboard should enforce monospace and no motion
    const dashboard = seq.generateFromArchetype("dashboard", "test-dashboard");
    assertEqual(dashboard.chromosomes.ch1_structure.topology, "flat", "Dashboard has flat topology");
    assertEqual(dashboard.chromosomes.ch8_motion.physics, "none", "Dashboard has no motion");
    assertEqual(dashboard.chromosomes.ch3_type_display.charge, "monospace", "Dashboard uses monospace");
    
    // Portfolio should allow spring motion
    const portfolio = seq.generateFromArchetype("portfolio", "test-portfolio");
    assertEqual(portfolio.chromosomes.ch1_structure.topology, "deep", "Portfolio has deep topology");
    assertEqual(portfolio.chromosomes.ch8_motion.physics, "spring", "Portfolio has spring motion");
}

// Test 4: Epistasis Rules
console.log("\nTest 4: Epistasis Rules (Constraint enforcement)");
{
    const seq = new GenomeSequencer();
    
    // High temporal urgency + dashboard should forbid animations
    const urgentTraits = {
        informationDensity: 0.8,
        temporalUrgency: 0.9,  // High urgency
        emotionalTemperature: 0.5,
        playfulness: 0.5,
        spatialDependency: 0.5
    };
    
    const genome = seq.generate("urgent-dashboard", urgentTraits);
    
    assert(genome.constraints.forbiddenPatterns.includes("parallax"), 
        "High urgency forbids parallax");
    assert(genome.constraints.bondingRules.some(r => r.includes("High Temporal Urgency")),
        "Bonding rule explains urgency constraint");
}

// Test 5: Pattern Detection
console.log("\nTest 5: Pattern Detection");
{
    const detector = new PatternDetector();
    
    const slopCSS = `
        .hero { @apply bg-gradient-to-r from-blue-500 to-purple-500; }
        .btn { @apply font-inter rounded-xl shadow-lg; }
    `;
    
    const violations = detector.detect(slopCSS);
    
    assert(violations.some(v => v.pattern === "blue_purple_gradient"), 
        "Detects blue-purple gradient");
    assert(violations.some(v => v.pattern === "font_inter"), 
        "Detects Inter font");
    assert(violations.some(v => v.pattern === "excessive_rounding"), 
        "Detects excessive rounding");
    assert(violations.some(v => v.pattern === "tailwind_gradient"), 
        "Detects Tailwind gradient");
}

// Test 6: Color Range
console.log("\nTest 6: Color Distribution");
{
    const seq = new GenomeSequencer();
    const hues = [];
    
    for (let i = 0; i < 100; i++) {
        const genome = seq.generate(`color-test-${i}`, {
            informationDensity: 0.5,
            temporalUrgency: 0.5,
            emotionalTemperature: 0.5,
            playfulness: 0.5,
            spatialDependency: 0.5
        });
        hues.push(genome.chromosomes.ch5_color_primary.hue);
    }
    
    const minHue = Math.min(...hues);
    const maxHue = Math.max(...hues);
    const range = maxHue - minHue;
    
    assert(range > 200, `Color range spans ${range}° (good distribution)`);
    assert(hues.every(h => h >= 0 && h <= 360), "All hues are valid (0-360)");
}

console.log("\n✅ All tests passed!");
console.log("\nStats:");
console.log("  - Determinism: Verified");
console.log("  - Uniqueness: Verified (10 unique seeds)");
console.log("  - Archetypes: Verified (dashboard, portfolio)");
console.log("  - Epistasis: Verified (constraint enforcement)");
console.log("  - Pattern Detection: Verified (4 slop patterns)");
console.log("  - Color Distribution: Verified (200°+ range)");
